import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { BankBlacklist } from '../entities';

export class SendBankToBlackListCommand {
  private constructor(
    public readonly bankId: Id,
    public readonly reason: BankBlacklist,
  ) {}

  static create(
    id: OptionalValue<string>,
    blacklistedBy: OptionalValue<string>,
    note: OptionalValue<string>,
  ): Result<SendBankToBlackListCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.BANK_ID_EMPTY,
        () => DomainErrorCode.BANK_ID_INVALID,
      ),
      Id.create(
        blacklistedBy,
        () => DomainErrorCode.BANK_BLACKLISTED_BY_EMPTY,
        () => DomainErrorCode.BANK_BLACKLISTED_BY_INVALID,
      ),
    ]).flatMap(([bankId, userId]: [Id, Id]) =>
      BankBlacklist.create(userId, note).map((reason) => new SendBankToBlackListCommand(bankId, reason)),
    );
  }
}
