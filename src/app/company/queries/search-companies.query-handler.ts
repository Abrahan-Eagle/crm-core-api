import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage, Types } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { SearchCompaniesQuery } from '@/domain/company';
import { CompanyDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { SearchCompanyResponse } from '../dtos';

@QueryHandler(SearchCompaniesQuery)
export class SearchCompaniesQueryHandler extends BaseQueryHandler<
  SearchCompaniesQuery,
  PaginatedResponse<SearchCompanyResponse>
> {
  constructor(
    @InjectModel(InjectionConstant.COMPANY_MODEL)
    private readonly model: Model<CompanyDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: SearchCompaniesQuery): Observable<PaginatedResponse<SearchCompanyResponse>> {
    const search = new RegExp(query.search, 'gi');
    const { pagination, onlyMine } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<CompanyDocument>()
          .match(onlyMine ? { created_by: new Types.ObjectId(this.context.store.userId) } : {})
          .match({
            $or: [
              { company_name: search },
              { dba: search },
              { tax_id: search },
              { 'emails.value': search },
              { 'phone_numbers.number': search },
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
            name: '$company_name',
            creation_date: '$creation_date',
            dba: '$dba',
            tax_id: '$tax_id',
            phone_numbers: '$phone_numbers',
            country_iso_code_2: '$address.country_iso_code_2',
            created_by: '$created_by',
            created_at: 1,
          }),
      ),
      mergeMap((aggregate) =>
        zip(this.getCompanies(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline())),
      ),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(SearchCompanyResponse, docs, {
            excludeExtraneousValues: true,
            hidePhone: !hasPermission(Permission.VIEW_FULL_PHONE, this.context.store.permissions),
            hideTaxId: !hasPermission(Permission.VIEW_FULL_TAX_ID, this.context.store.permissions),
          } as any),
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
