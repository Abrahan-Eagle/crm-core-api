import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Aggregate, Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { GetProspectByIdQuery, Prospect } from '@/domain/leads';
import { ProspectDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { ProspectResponse } from '../dtos';

@QueryHandler(GetProspectByIdQuery)
export class GetProspectByIdQueryHandler extends BaseQueryHandler<GetProspectByIdQuery, ProspectResponse> {
  constructor(
    @InjectModel(InjectionConstant.PROSPECT_MODEL)
    private readonly model: Model<ProspectDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetProspectByIdQuery): Observable<ProspectResponse> {
    const { prospectId, leadId } = query;

    return of({}).pipe(
      map(() =>
        new Aggregate<ProspectDocument>()
          .match({
            _id: new Types.ObjectId(prospectId.toString()),
            lead_group_id: new Types.ObjectId(leadId.toString()),
          })
          .addFields({ id: '$_id' })
          .unwind({
            path: '$notes',
            preserveNullAndEmptyArrays: true,
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'notes.author',
            foreignField: '_id',
            as: 'notes.author',
            pipeline: [{ $project: { first_name: 1, last_name: 1 } }],
          })
          .unwind({
            path: '$notes.author',
            preserveNullAndEmptyArrays: true,
          })
          .group({
            _id: '$_id',
            notes: {
              $push: '$notes',
            },
            prospect: {
              $first: '$$ROOT',
            },
          })
          .replaceRoot({
            $mergeObjects: [
              '$prospect',
              {
                notes: {
                  $filter: {
                    input: '$notes',
                    as: 'note',
                    cond: { $ne: ['$$note', {}] },
                  },
                },
              },
            ],
          })
          .unwind({
            path: '$call_history',
            preserveNullAndEmptyArrays: true,
          })
          .lookup({
            from: CollectionNames.USER,
            localField: 'call_history.created_by',
            foreignField: '_id',
            as: 'call_history.created_by',
            pipeline: [{ $project: { first_name: 1, last_name: 1 } }],
          })
          .unwind({
            path: '$call_history.created_by',
            preserveNullAndEmptyArrays: true,
          })
          .group({
            _id: '$_id',
            call_history: {
              $push: '$call_history',
            },
            prospect: {
              $first: '$$ROOT',
            },
          })
          .replaceRoot({
            $mergeObjects: [
              '$prospect',
              {
                call_history: {
                  $filter: {
                    input: '$call_history',
                    as: 'log',
                    cond: { $ne: ['$$log', {}] },
                  },
                },
              },
            ],
          }),
      ),
      mergeMap((aggregate) => this.model.aggregate<ProspectDocument>(aggregate.pipeline()).exec()),
      map(([doc]) => doc),
      throwIfVoid(() => NotFound.of(Prospect, prospectId.toString())),
      map((prospect) =>
        plainToInstance(ProspectResponse, prospect, {
          excludeExtraneousValues: true,
          hidePhone: !hasPermission(Permission.VIEW_FULL_PHONE, this.context.store.permissions),
          hideEmail: !hasPermission(Permission.VIEW_FULL_EMAIL, this.context.store.permissions),
        } as any),
      ),
    );
  }
}
