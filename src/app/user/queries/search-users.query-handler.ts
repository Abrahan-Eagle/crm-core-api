import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { SearchUsersQuery } from '@/domain/user';
import { UserDocument } from '@/infra/adapters';

import { UserResponse } from '../dtos';

@QueryHandler(SearchUsersQuery)
export class SearchUsersQueryHandler extends BaseQueryHandler<SearchUsersQuery, PaginatedResponse<UserResponse>> {
  constructor(
    @InjectModel(InjectionConstant.USER_MODEL)
    private readonly model: Model<UserDocument>,
  ) {
    super();
  }

  handle(query: SearchUsersQuery): Observable<PaginatedResponse<UserResponse>> {
    const search = new RegExp(query.search, 'gi');
    const { pagination } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<UserDocument>()
          .match({
            $or: [{ first_name: search }, { last_name: search }, { email: search }],
          })
          .addFields({
            status: {
              $cond: {
                if: {
                  $or: [{ $eq: ['$deleted_at', null] }, { $not: ['$deleted_at'] }],
                },
                then: 'ACTIVE',
                else: 'INACTIVE',
              },
            },
          }),
      ),
      mergeMap((aggregate) =>
        zip(this.getUsers(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline())),
      ),
      map(([docs, count]) =>
        PaginatedResponse.of(plainToInstance(UserResponse, docs, { excludeExtraneousValues: true }), count, pagination),
      ),
    );
  }

  private getUsers(pipeline: PipelineStage[], pagination: PaginationQuery): Observable<UserDocument[]> {
    const { offset, limit } = pagination;
    return of(pipeline).pipe(
      map(() => this.model.aggregate<UserDocument>(pipeline)),
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
