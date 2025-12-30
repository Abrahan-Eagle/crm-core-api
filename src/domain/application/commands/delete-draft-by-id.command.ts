import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class DeleteDraftByIdCommand {
  private constructor(public readonly draftId: Id) {}

  static create(draftId: OptionalValue<string>): Result<DeleteDraftByIdCommand> {
    return Id.create(
      draftId,
      () => DomainErrorCode.DRAFT_ID_EMPTY,
      () => DomainErrorCode.DRAFT_ID_INVALID,
    ).map((id) => new DeleteDraftByIdCommand(id));
  }
}
