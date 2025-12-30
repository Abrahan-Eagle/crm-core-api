import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import { GetBankNotificationsQuery } from '@/domain/application';
import { ApplicationDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage, hasPermission, Permission } from '@/infra/common';

import { BankNotificationResponse } from '../dtos';

@QueryHandler(GetBankNotificationsQuery)
export class GetBankNotificationsQueryHandler extends BaseQueryHandler<
  GetBankNotificationsQuery,
  BankNotificationResponse[]
> {
  constructor(
    @InjectModel(InjectionConstant.APPLICATION_MODEL)
    private readonly model: Model<ApplicationDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetBankNotificationsQuery): Observable<BankNotificationResponse[]> {
    return of(query).pipe(
      mergeMap(({ id }) =>
        this.model
          .aggregate<ApplicationDocument>()
          .match({ _id: new Types.ObjectId(id.toString()), tenant_id: this.context.store.tenantId })
          .unwind({
            path: '$notifications',
            preserveNullAndEmptyArrays: false,
          })
          .replaceRoot('$notifications')
          .lookup({
            from: CollectionNames.BANK,
            localField: 'bank_id',
            foreignField: '_id',
            as: 'bank',
            pipeline: [
              {
                $project: {
                  name: '$bank_name',
                  bank_type: 1,
                },
              },
            ],
          })
          .unwind({
            path: '$bank',
            preserveNullAndEmptyArrays: false,
          })
          .addFields({
            id: '$_id',
          })
          .exec(),
      ),
      map((notifications) =>
        plainToInstance(BankNotificationResponse, notifications, {
          excludeExtraneousValues: true,
          hideBankName: !hasPermission(Permission.VIEW_FULL_NOTIFICATION, this.context.store.permissions),
        } as any),
      ),
    );
  }
}
