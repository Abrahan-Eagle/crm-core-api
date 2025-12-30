import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Offer } from '../entities';

export class CreateOfferCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly notificationId: Id,
    public readonly offer: Offer,
  ) {}

  static create(
    id: OptionalValue<string>,
    applicationId: OptionalValue<string>,
    notificationId: OptionalValue<string>,
    purchasedAmount: OptionalValue<number>,
    factorRate: OptionalValue<number>,
    position: OptionalValue<number>,
    points: OptionalValue<number>,
    paymentPlan: OptionalValue<string>,
    paymentPlanDuration: OptionalValue<number>,
  ): Result<CreateOfferCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      Id.create(
        notificationId,
        () => DomainErrorCode.NOTIFICATION_ID_EMPTY,
        () => DomainErrorCode.NOTIFICATION_ID_INVALID,
      ),
      Id.create(
        id,
        () => DomainErrorCode.OFFER_ID_EMPTY,
        () => DomainErrorCode.OFFER_ID_INVALID,
      ).flatMap((id) =>
        Offer.create(id, purchasedAmount, factorRate, position, points, paymentPlan, paymentPlanDuration),
      ),
    ]).map((params) => new CreateOfferCommand(...params));
  }
}
