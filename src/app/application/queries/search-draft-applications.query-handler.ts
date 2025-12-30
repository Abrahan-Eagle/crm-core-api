import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage, Types } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { SearchDraftApplicationsQuery } from '@/domain/application';
import { DraftApplicationDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { SearchDraftApplicationsResponse } from '../dtos';

@QueryHandler(SearchDraftApplicationsQuery)
export class SearchDraftApplicationsQueryHandler extends BaseQueryHandler<
  SearchDraftApplicationsQuery,
  PaginatedResponse<SearchDraftApplicationsResponse>
> {
  constructor(
    @InjectModel(InjectionConstant.DRAFT_APPLICATION_MODEL)
    private readonly model: Model<DraftApplicationDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: SearchDraftApplicationsQuery) {
    const search = new RegExp(query.search, 'gi');
    const { pagination, onlyMine } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<DraftApplicationDocument>()
          .match(
            onlyMine
              ? {
                  created_by: new Types.ObjectId(this.context.store.userId),
                }
              : {},
          )
          .lookup({
            from: CollectionNames.COMPANY,
            localField: 'company_id',
            foreignField: '_id',
            as: 'company',
            pipeline: [
              {
                $project: {
                  id: '$_id',
                  name: '$company_name',
                  dba: 1,
                  country_iso_code_2: '$address.country_iso_code_2',
                },
              },
            ],
          })
          .unwind({
            path: '$company',
            preserveNullAndEmptyArrays: false,
          })
          .match({
            $or: [{ 'company.name': search }, { 'company.dba': search }],
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by',
            pipeline: [
              {
                $project: {
                  first_name: 1,
                  last_name: 1,
                },
              },
            ],
          })
          .unwind({
            path: '$created_by',
            preserveNullAndEmptyArrays: true,
          })
          .project({
            id: '$_id',
            period: 1,
            loan_amount: 1,
            product: 1,
            company: 1,
            created_by: 1,
            created_at: 1,
          }),
      ),
      mergeMap((aggregate) =>
        zip(this.getApplications(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline())),
      ),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(SearchDraftApplicationsResponse, docs, { excludeExtraneousValues: true }),
          count,
          pagination,
        ),
      ),
    );
  }

  private getApplications(
    pipeline: PipelineStage[],
    pagination: PaginationQuery,
  ): Observable<DraftApplicationDocument[]> {
    const { offset, limit } = pagination;

    return of(pipeline).pipe(
      map(() => this.model.aggregate<DraftApplicationDocument>(pipeline)),
      map((aggregate) => (pagination.hasSortBy() ? aggregate.sort(pagination.getSortObject()) : aggregate)),
      mergeMap((aggregate) => aggregate.skip(offset).limit(limit).exec()),
    );
  }

  private getCount(pipeline: PipelineStage[]): Observable<number> {
    return of(pipeline).pipe(
      mergeMap((pipeline) => this.model.aggregate(pipeline).count('count').exec()),
      map(([result]) => result?.count ?? 0),
    );
  }
}
