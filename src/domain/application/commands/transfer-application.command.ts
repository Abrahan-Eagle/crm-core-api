import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class TransferApplicationCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly userId: Id,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    userId: OptionalValue<string>,
  ): Result<TransferApplicationCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      Id.create(
        userId,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ),
    ]).map((params) => new TransferApplicationCommand(...params));
  }
}
