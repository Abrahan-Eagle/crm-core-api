import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class TransferLeadPropertyCommand {
  private constructor(
    public readonly leadId: Id,
    public readonly userId: Id,
  ) {}

  static create(leadId: OptionalValue<string>, userId: OptionalValue<string>): Result<TransferLeadPropertyCommand> {
    return Result.combine([
      Id.create(
        leadId,
        () => DomainErrorCode.LEAD_ID_EMPTY,
        () => DomainErrorCode.LEAD_ID_INVALID,
      ),
      Id.create(
        userId,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ),
    ]).map(([leadId, userId]) => new TransferLeadPropertyCommand(leadId, userId));
  }
}
