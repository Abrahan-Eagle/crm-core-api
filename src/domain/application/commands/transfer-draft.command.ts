import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class TransferDraftCommand {
  private constructor(
    public readonly draftId: Id,
    public readonly userId: Id,
  ) {}

  static create(draftId: OptionalValue<string>, userId: OptionalValue<string>): Result<TransferDraftCommand> {
    return Result.combine([
      Id.create(
        draftId,
        () => DomainErrorCode.DRAFT_ID_EMPTY,
        () => DomainErrorCode.DRAFT_ID_INVALID,
      ),
      Id.create(
        userId,
        () => DomainErrorCode.USER_ID_EMPTY,
        () => DomainErrorCode.USER_ID_INVALID,
      ),
    ]).map((params) => new TransferDraftCommand(...params));
  }
}
