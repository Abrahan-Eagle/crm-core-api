import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage, Types } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { GetCompaniesByContactIdQuery } from '@/domain/company';
import { CompanyDocument } from '@/infra/adapters';

import { CompanyResponse } from '../dtos';

@QueryHandler(GetCompaniesByContactIdQuery)
export class GetCompaniesByContactIdQueryHandler extends BaseQueryHandler<
  GetCompaniesByContactIdQuery,
  PaginatedResponse<CompanyResponse>
> {
  constructor(
    @InjectModel(InjectionConstant.COMPANY_MODEL)
    private readonly model: Model<CompanyDocument>,
  ) {
    super();
  }

  handle(query: GetCompaniesByContactIdQuery): Observable<PaginatedResponse<CompanyResponse>> {
    const { pagination, contactId } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<CompanyDocument>()
          .match({ 'members.contact_id': new Types.ObjectId(contactId.toString()) })
          .project({
            id: '$_id',
            name: '$company_name',
            dba: 1,
            members: {
              $filter: {
                input: '$members',
                as: 'member',
                cond: {
                  $eq: ['$$member.contact_id', new Types.ObjectId(contactId.toString())],
                },
                limit: 2,
              },
            },
          }),
      ),
      mergeMap((aggregate) =>
        zip(this.getCompanies(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline())),
      ),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(CompanyResponse, docs, {
            excludeExtraneousValues: true,
          }),
          count,
          pagination,
        ),
      ),
    );
  }

  private getCompanies(pipeline: PipelineStage[], pagination: PaginationQuery): Observable<CompanyDocument[]> {
    const { offset, limit } = pagination;
    return of(pipeline).pipe(
      map(() => this.model.aggregate<CompanyDocument>(pipeline)),
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
