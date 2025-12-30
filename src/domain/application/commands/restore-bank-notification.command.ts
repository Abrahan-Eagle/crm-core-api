import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class RestoreBankNotificationCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly notificationId: Id,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    notificationId: OptionalValue<string>,
  ): Result<RestoreBankNotificationCommand> {
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
    ]).map((params) => new RestoreBankNotificationCommand(...params));
  }
}
