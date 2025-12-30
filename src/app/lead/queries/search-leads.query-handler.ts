import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage, Types } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { SearchLeadQuery } from '@/domain/leads';
import { LeadGroupDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { SearchLeadResponse } from '../dtos';

@QueryHandler(SearchLeadQuery)
export class SearchLeadQueryHandler extends BaseQueryHandler<SearchLeadQuery, PaginatedResponse<SearchLeadResponse>> {
  constructor(
    @InjectModel(InjectionConstant.LEAD_MODEL)
    private readonly model: Model<LeadGroupDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: SearchLeadQuery): Observable<PaginatedResponse<SearchLeadResponse>> {
    const search = new RegExp(query.search, 'gi');
    const { pagination } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<LeadGroupDocument>()
          .match(
            hasPermission(Permission.LIST_OWN_LEADS, this.context.store.permissions)
              ? { assigned_to: new Types.ObjectId(this.context.store.userId) }
              : {},
          )
          .match({
            $or: [{ name: search }],
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by',
            pipeline: [{ $project: { first_name: 1, last_name: 1 } }],
          })
          .unwind({
            path: '$created_by',
            preserveNullAndEmptyArrays: true,
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'assigned_to',
            foreignField: '_id',
            as: 'assigned_to',
            pipeline: [{ $project: { first_name: 1, last_name: 1 } }],
          })
          .unwind({
            path: '$assigned_to',
            preserveNullAndEmptyArrays: true,
          })
          .project({
            id: '$_id',
            name: 1,
            assigned_to: 1,
            created_by: 1,
            created_at: 1,
            prospect_count: 1,
          }),
      ),
      mergeMap((aggregate) => zip(this.getDocs(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline()))),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(SearchLeadResponse, docs, {
            excludeExtraneousValues: true,
          }),
          count,
          pagination,
        ),
      ),
    );
  }

  private getDocs(pipeline: PipelineStage[], pagination: PaginationQuery): Observable<LeadGroupDocument[]> {
    const { offset, limit } = pagination;
    return of(pipeline).pipe(
      map(() => this.model.aggregate<LeadGroupDocument>(pipeline)),
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
