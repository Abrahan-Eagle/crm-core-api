import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { Commission, GetCommissionByIdQuery } from '@/domain/commission';
import { CommissionDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { CommissionResponse } from '../dtos';

@QueryHandler(GetCommissionByIdQuery)
export class GetCommissionByIdQueryHandler extends BaseQueryHandler<GetCommissionByIdQuery, CommissionResponse> {
  constructor(
    @InjectModel(InjectionConstant.COMMISSION_MODEL)
    private readonly model: Model<CommissionDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetCommissionByIdQuery): Observable<CommissionResponse> {
    return of(query).pipe(
      map(({ id }) => ({
        _id: new Types.ObjectId(id.toString()),
      })),
      mergeMap(({ _id }) =>
        this.model
          .aggregate<CommissionDocument>()
          .match({ _id, tenant_id: this.context.store.tenantId })
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
          .lookup({
            from: CollectionNames.APPLICATION,
            localField: 'application_id',
            foreignField: '_id',
            as: 'application',
            pipeline: [
              {
                $addFields: {
                  notifications: {
                    $first: {
                      $filter: {
                        input: '$notifications',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.status', 'ACCEPTED'],
                        },
                      },
                    },
                  },
                },
              },
              {
                $addFields: {
                  offer: {
                    $first: {
                      $filter: {
                        input: '$notifications.offers',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.status', 'ACCEPTED'],
                        },
                      },
                    },
                  },
                },
              },
              {
                $unwind: {
                  path: '$offer',
                  preserveNullAndEmptyArrays: false,
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$offer',
                },
              },
              {
                $project: {
                  factor_rate: 1,
                  points: 1,
                  term: 1,
                  amount_financed: '$purchased_amount',
                },
              },
            ],
          })
          .unwind({
            path: '$application',
            preserveNullAndEmptyArrays: false,
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'commission.distribution.user_id',
            foreignField: '_id',
            as: 'commission_distributions_users',
            pipeline: [
              {
                $project: {
                  first_name: 1,
                  last_name: 1,
                },
              },
            ],
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'psf.distribution.user_id',
            foreignField: '_id',
            as: 'psf_distributions_users',
            pipeline: [
              {
                $project: {
                  first_name: 1,
                  last_name: 1,
                },
              },
            ],
          })
          .addFields({
            'commission.distribution': {
              $map: {
                input: {
                  $zip: {
                    inputs: ['$commission.distribution', '$commission_distributions_users'],
                  },
                },
                as: 'pair',
                in: {
                  $mergeObjects: [
                    { $arrayElemAt: ['$$pair', 0] },
                    {
                      user: { $arrayElemAt: ['$$pair', 1] },
                    },
                  ],
                },
              },
            },
            'psf.distribution': {
              $map: {
                input: {
                  $zip: {
                    inputs: ['$psf.distribution', '$psf_distributions_users'],
                  },
                },
                as: 'pair',
                in: {
                  $mergeObjects: [
                    { $arrayElemAt: ['$$pair', 0] },
                    {
                      user: { $arrayElemAt: ['$$pair', 1] },
                    },
                  ],
                },
              },
            },
          })
          .exec(),
      ),
      map(([commission]) => commission),
      throwIfVoid(() => NotFound.of(Commission, query.id)),
      map((app) => plainToInstance(CommissionResponse, app, { excludeExtraneousValues: true })),
    );
  }
}
