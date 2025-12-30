import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { BankNotification } from '../entities';

export class AddNotificationsToApplicationCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly message: string,
    public readonly bankNotifications: BankNotification[],
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    message: OptionalValue<string>,
    bankIds: OptionalValue<string[]>,
  ): Result<AddNotificationsToApplicationCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      BankNotification.validateNotificationMessage(message),
      Validator.of(bankIds)
        .required(() => DomainErrorCode.BANK_IDS_EMPTY)
        .array(() => DomainErrorCode.BANK_IDS_INVALID)
        .minLength(1, () => DomainErrorCode.BANK_IDS_EMPTY)
        .flatMap((ids) =>
          Result.combine(
            ids.map((id) =>
              Id.create(
                id,
                () => DomainErrorCode.BANK_ID_EMPTY,
                () => DomainErrorCode.BANK_ID_INVALID,
              ).flatMap((id) => BankNotification.create(id)),
            ),
          ),
        ),
    ]).map((params) => new AddNotificationsToApplicationCommand(...params));
  }
}
