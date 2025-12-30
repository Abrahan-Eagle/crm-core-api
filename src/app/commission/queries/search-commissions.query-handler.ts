import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { SearchCommissionsQuery } from '@/domain/commission';
import { ApplicationDocument, CommissionDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { SearchCommissionsResponse } from '../dtos';

@QueryHandler(SearchCommissionsQuery)
export class SearchCommissionsQueryHandler extends BaseQueryHandler<
  SearchCommissionsQuery,
  PaginatedResponse<SearchCommissionsResponse>
> {
  constructor(
    @InjectModel(InjectionConstant.COMMISSION_MODEL)
    private readonly model: Model<CommissionDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: SearchCommissionsQuery): Observable<PaginatedResponse<SearchCommissionsResponse>> {
    const search = new RegExp(query.search, 'gi');
    const { pagination } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<ApplicationDocument>()
          .match({ tenant_id: this.context.store.tenantId })
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
          .lookup({
            from: CollectionNames.BANK,
            localField: 'bank_id',
            foreignField: '_id',
            as: 'bank',
            pipeline: [
              {
                $project: {
                  id: '$_id',
                  name: '$bank_name',
                },
              },
            ],
          })
          .unwind({
            path: '$bank',
            preserveNullAndEmptyArrays: false,
          })
          .match({
            $or: [{ 'company.name': search }, { 'company.dba': search }],
          })
          .project({
            id: '$_id',
            bank: 1,
            psf: '$psf.total',
            commission: '$commission.total',
            status: 1,
            company: 1,
            created_at: 1,
          }),
      ),
      mergeMap((aggregate) =>
        zip(this.getApplications(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline())),
      ),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(SearchCommissionsResponse, docs, { excludeExtraneousValues: true }),
          count,
          pagination,
        ),
      ),
    );
  }

  private getApplications(pipeline: PipelineStage[], pagination: PaginationQuery): Observable<ApplicationDocument[]> {
    const { offset, limit } = pagination;

    return of(pipeline).pipe(
      map(() => this.model.aggregate<ApplicationDocument>(pipeline)),
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
