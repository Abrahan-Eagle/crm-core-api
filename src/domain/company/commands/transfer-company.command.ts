import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class TransferCompanyCommand {
  private constructor(
    public readonly companyId: Id,
    public readonly userId: Id,
  ) {}

  static create(companyId: OptionalValue<string>, userId: OptionalValue<string>): Result<TransferCompanyCommand> {
    return Result.combine([
      Id.create(
        companyId,
        () => DomainErrorCode.COMPANY_ID_EMPTY,
        () => DomainErrorCode.COMPANY_ID_INVALID,
      ),
      Id.create(
        userId,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ),
    ]).map((params) => new TransferCompanyCommand(...params));
  }
}
