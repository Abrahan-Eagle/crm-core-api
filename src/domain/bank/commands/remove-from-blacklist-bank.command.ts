import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class RemoveFromBlacklistBankCommand {
  private constructor(public readonly bankId: Id) {}

  static create(id: OptionalValue<string>): Result<RemoveFromBlacklistBankCommand> {
    return Id.create(
      id,
      () => DomainErrorCode.BANK_ID_EMPTY,
      () => DomainErrorCode.BANK_ID_INVALID,
    ).map((bankId) => new RemoveFromBlacklistBankCommand(bankId));
  }
}
