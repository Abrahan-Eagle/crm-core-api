import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { CAMPAIGN_CONTACT_STATUS, GetCampaignsQuery } from '@/domain/campaign';
import { CampaignDocument } from '@/infra/adapters';

import { CampaignResponse } from '../dtos';

@QueryHandler(GetCampaignsQuery)
export class GetCampaignsQueryHandler extends BaseQueryHandler<GetCampaignsQuery, CampaignResponse[]> {
  constructor(
    @InjectModel(InjectionConstant.CAMPAIGN_MODEL)
    private readonly model: Model<CampaignDocument>,
  ) {
    super();
  }

  handle(): Observable<CampaignResponse[]> {
    return of({}).pipe(
      mergeMap(() =>
        this.model
          .aggregate<CampaignDocument>(
            new Aggregate<CampaignDocument>()
              .lookup({
                from: CollectionNames.CAMPAIGN_CONTACT,
                localField: '_id',
                foreignField: 'campaign_id',
                as: 'pending',
                pipeline: [
                  {
                    $match: {
                      status: CAMPAIGN_CONTACT_STATUS.PENDING,
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      pending: {
                        $count: {},
                      },
                    },
                  },
                ],
              })
              .unwind({
                path: '$pending',
                preserveNullAndEmptyArrays: true,
              })
              .addFields({
                id: '$_id',
                pending: {
                  $ifNull: ['$pending.pending', 0],
                },
                status: {
                  $cond: {
                    if: { $eq: ['$job_id', null] },
                    then: 'STOPPED',
                    else: {
                      $cond: {
                        if: {
                          $gt: [{ $ifNull: ['$pending.pending', 0] }, 0],
                        },
                        then: 'SENDING',
                        else: 'COMPLETED',
                      },
                    },
                  },
                },
              })
              .sort({
                _id: -1,
              })
              .pipeline(),
          )
          .exec(),
      ),
      map((docs) => plainToInstance(CampaignResponse, docs, { excludeExtraneousValues: true })),
    );
  }
}
