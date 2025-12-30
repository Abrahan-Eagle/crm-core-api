import { Nullable, OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Offer } from '../entities';

export class UpdateOfferCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly notificationId: Id,
    public readonly offerId: Id,
    public readonly purchasedAmount: Nullable<number>,
    public readonly factorRate: Nullable<number>,
    public readonly position: Nullable<number>,
    public readonly points: Nullable<number>,
    public readonly paymentPlan: Nullable<string>,
    public readonly paymentPlanDuration: Nullable<number>,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    notificationId: OptionalValue<string>,
    offerId: OptionalValue<string>,
    purchasedAmount: OptionalValue<number>,
    factorRate: OptionalValue<number>,
    position: OptionalValue<number>,
    points: OptionalValue<number>,
    paymentPlan: OptionalValue<string>,
    paymentPlanDuration: OptionalValue<number>,
  ): Result<UpdateOfferCommand> {
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
        offerId,
        () => DomainErrorCode.OFFER_ID_EMPTY,
        () => DomainErrorCode.OFFER_ID_INVALID,
      ),
      Offer.validatePurchasedAmount(purchasedAmount),
      Offer.validateFactorRate(factorRate),
      Offer.validatePosition(position),
      Offer.validatePoints(points),
      Offer.validatePaymentPlan(paymentPlan),
      Offer.validatePaymentPlanDuration(paymentPlanDuration),
    ]).map((params) => new UpdateOfferCommand(...params));
  }
}
