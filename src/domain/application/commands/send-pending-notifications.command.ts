import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { BankNotification } from '../entities';

export class SendPendingNotificationsCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly message: string,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    message: OptionalValue<string>,
  ): Result<SendPendingNotificationsCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_COMPANY_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_COMPANY_ID_INVALID,
      ),
      BankNotification.validateNotificationMessage(message),
    ]).map((params) => new SendPendingNotificationsCommand(...params));
  }
}
