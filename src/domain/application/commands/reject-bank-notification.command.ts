import { Nullable, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { BankNotification, REJECT_REASONS } from '../entities';

export class RejectBankNotificationCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly notificationId: Id,
    public readonly reason: REJECT_REASONS,
    public readonly other: Nullable<string>,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    notificationId: OptionalValue<string>,
    reason: OptionalValue<string>,
    other: OptionalValue<string>,
  ): Result<RejectBankNotificationCommand> {
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
      Validator.of(reason)
        .required(() => DomainErrorCode.NOTIFICATION_REJECT_REASON_EMPTY)
        .enum(REJECT_REASONS, () => DomainErrorCode.NOTIFICATION_REJECT_REASON_INVALID),
      reason == REJECT_REASONS.OTHER
        ? Validator.of(other)
            .required(() => DomainErrorCode.NOTIFICATION_REJECT_OTHER_EMPTY)
            .string(() => DomainErrorCode.NOTIFICATION_REJECT_REASON_INVALID)
            .map((value) => value.trim())
            .notEmpty(() => DomainErrorCode.NOTIFICATION_REJECT_OTHER_EMPTY)
            .flatMap(() => BankNotification.validateRejectDescription(other))
        : Result.ok(null),
    ]).map((params) => new RejectBankNotificationCommand(...params));
  }
}
