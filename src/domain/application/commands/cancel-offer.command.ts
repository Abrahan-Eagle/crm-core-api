import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class CancelOfferCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly notificationId: Id,
    public readonly offerId: Id,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    notificationId: OptionalValue<string>,
    offerId: OptionalValue<string>,
  ): Result<CancelOfferCommand> {
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
    ]).map((params) => new CancelOfferCommand(...params));
  }
}
