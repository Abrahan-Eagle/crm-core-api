import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage, Types } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { SearchProspectsQuery } from '@/domain/leads';
import { LeadGroupDocument, ProspectDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { SearchProspectsResponse } from '../dtos';

@QueryHandler(SearchProspectsQuery)
export class SearchProspectsQueryHandler extends BaseQueryHandler<
  SearchProspectsQuery,
  PaginatedResponse<SearchProspectsResponse>
> {
  constructor(
    @InjectModel(InjectionConstant.PROSPECT_MODEL)
    private readonly model: Model<ProspectDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: SearchProspectsQuery): Observable<PaginatedResponse<SearchProspectsResponse>> {
    const search = new RegExp(query.search, 'gi');
    const { pagination, leadId } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<ProspectDocument>()
          .match({
            lead_group_id: new Types.ObjectId(leadId.toString()),
            $or: [{ name: search }, { company: search }, { 'phone.number': search }, { email: search }],
          })
          .addFields({
            priority: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$follow_up_call' } },
                        { $dateToString: { format: '%Y-%m-%d', date: new Date() } },
                      ],
                    },
                    {
                      $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$last_call' } },
                        { $dateToString: { format: '%Y-%m-%d', date: new Date() } },
                      ],
                    },
                  ],
                },
                4,
                {
                  $cond: [
                    {
                      $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$follow_up_call' } },
                        { $dateToString: { format: '%Y-%m-%d', date: new Date() } },
                      ],
                    },
                    1,
                    {
                      $cond: [{ $and: [{ $eq: ['$follow_up_call', null] }, { $eq: ['$last_call', null] }] }, 2, 3],
                    },
                  ],
                },
              ],
            },
          })
          .lookup({
            from: CollectionNames.LEAD,
            localField: 'lead_group_id',
            foreignField: '_id',
            as: 'lead_group',
          })
          .match(
            hasPermission(Permission.LIST_OWN_LEADS, this.context.store.permissions)
              ? {
                  'lead_group.assigned_to': new Types.ObjectId(this.context.store.userId),
                }
              : {},
          )
          .addFields({
            id: '$_id',
            note_count: {
              $size: '$notes',
            },
          })
          .sort({ priority: 1, _id: 1 }),
      ),
      mergeMap((aggregate) => zip(this.getDocs(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline()))),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(SearchProspectsResponse, docs, {
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
