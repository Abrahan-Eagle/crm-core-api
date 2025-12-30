import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage, Types } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { ContactDocument, SearchContactsQuery } from '@/domain/contact';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { SearchContactResponse } from '../dtos';

@QueryHandler(SearchContactsQuery)
export class SearchContactsQueryHandler extends BaseQueryHandler<
  SearchContactsQuery,
  PaginatedResponse<SearchContactResponse>
> {
  constructor(
    @InjectModel(InjectionConstant.CONTACT_MODEL)
    private readonly model: Model<ContactDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: SearchContactsQuery): Observable<PaginatedResponse<SearchContactResponse>> {
    const search = new RegExp(query.search, 'gi');
    const { pagination, onlyMine } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<ContactDocument>()
          .match(onlyMine ? { created_by: new Types.ObjectId(this.context.store.userId) } : {})
          .match({
            $or: [
              { first_name: search },
              { last_name: search },
              { ssn: search },
              { 'emails.value': search },
              { 'phones.number': search },
            ],
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
          .project({
            id: '$_id',
            first_name: '$first_name',
            last_name: '$last_name',
            emails: '$emails.value',
            phones: '$phones',
            country_iso_code_2: '$address.country_iso_code_2',
            created_by: '$created_by',
            created_at: 1,
          }),
      ),
      mergeMap((aggregate) =>
        zip(this.getContacts(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline())),
      ),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(SearchContactResponse, docs, {
            excludeExtraneousValues: true,
            hidePhone: !hasPermission(Permission.VIEW_FULL_PHONE, this.context.store.permissions),
            hideEmail: !hasPermission(Permission.VIEW_FULL_EMAIL, this.context.store.permissions),
          } as any),
          count,
          pagination,
        ),
      ),
    );
  }

  private getContacts(pipeline: PipelineStage[], pagination: PaginationQuery): Observable<ContactDocument[]> {
    const { offset, limit } = pagination;
    return of(pipeline).pipe(
      map(() => this.model.aggregate<ContactDocument>(pipeline)),
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
