import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class PublishDraftApplicationCommand {
  private constructor(public readonly draftId: Id) {}

  static create(draftId: OptionalValue<string>): Result<PublishDraftApplicationCommand> {
    return Id.create(
      draftId,
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    ).map((id) => new PublishDraftApplicationCommand(id));
  }
}
