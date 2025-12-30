import { Email, Nullable, OptionalValue, Result } from '@internal/common';

import { Application, BankNotification, REJECT_REASONS } from '../entities';

export class RejectBankNotificationViaWebhookCommand {
  private constructor(
    public readonly trackingId: string,
    public readonly bankEmail: Email,
    public readonly reason: REJECT_REASONS,
    public readonly other: Nullable<string>,
  ) {}

  static create(
    trackingId: OptionalValue<string>,
    bankEmail: OptionalValue<string>,
    reason: OptionalValue<string>,
    other: OptionalValue<string>,
  ): Result<RejectBankNotificationViaWebhookCommand> {
    return Result.combine([
      Application.validateTrackingId(trackingId),
      Email.createUnverified(bankEmail),
      BankNotification.validateRejectReason(reason),
      other !== undefined && other ? BankNotification.validateRejectDescription(other) : Result.ok(null),
    ]).map((params) => new RejectBankNotificationViaWebhookCommand(...params));
  }
}
