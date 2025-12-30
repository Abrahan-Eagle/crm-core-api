import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { PaginatedResponse, PaginationQuery } from '@internal/http';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, PipelineStage, Types } from 'mongoose';
import { map, mergeMap, Observable, of, zip } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { ApplicationDocument } from '@/domain/application';
import { GetBankOffersQuery } from '@/domain/bank';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { BankOfferResponse } from '../dtos';

@QueryHandler(GetBankOffersQuery)
export class GetBankOffersQueryHandler extends BaseQueryHandler<
  GetBankOffersQuery,
  PaginatedResponse<BankOfferResponse>
> {
  constructor(
    @InjectModel(InjectionConstant.APPLICATION_MODEL)
    private readonly model: Model<ApplicationDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetBankOffersQuery): Observable<PaginatedResponse<BankOfferResponse>> {
    const { pagination, bankId } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<ApplicationDocument>()
          .match({
            'notifications.bank_id': new Types.ObjectId(bankId.toString()),
            tenant_id: this.context.store.tenantId,
          })
          .unwind({
            path: '$notifications',
            preserveNullAndEmptyArrays: false,
          })
          .match({
            'notifications.bank_id': new Types.ObjectId(bankId.toString()),
          })
          .unwind({
            path: '$notifications.offers',
            preserveNullAndEmptyArrays: false,
          })
          .lookup({
            from: CollectionNames.COMPANY,
            localField: 'company_id',
            foreignField: '_id',
            as: 'company',
            pipeline: [
              {
                $project: {
                  name: '$company_name',
                  dba: 1,
                },
              },
            ],
          })
          .unwind({
            path: '$company',
            preserveNullAndEmptyArrays: false,
          })
          .project({
            id: '$_id',
            company: 1,
            offer: '$notifications.offers',
          }),
      ),
      mergeMap((aggregate) => zip(this.getDocs(aggregate.pipeline(), pagination), this.getCount(aggregate.pipeline()))),
      map(([docs, count]) =>
        PaginatedResponse.of(
          plainToInstance(BankOfferResponse, docs, { excludeExtraneousValues: true }),
          count,
          pagination,
        ),
      ),
    );
  }

  private getDocs(pipeline: PipelineStage[], pagination: PaginationQuery): Observable<ApplicationDocument[]> {
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
