import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class RemoveContactNoteCommand {
  private constructor(
    public readonly contactId: Id,
    public readonly noteId: Id,
  ) {}

  static create(contactId: OptionalValue<string>, noteId: OptionalValue<string>): Result<RemoveContactNoteCommand> {
    return Result.combine([
      Id.create(
        contactId,
        () => DomainErrorCode.CONTACT_ID_EMPTY,
        () => DomainErrorCode.CONTACT_ID_INVALID,
      ),
      Id.create(
        noteId,
        () => DomainErrorCode.NOTE_ID_EMPTY,
        () => DomainErrorCode.NOTE_ID_INVALID,
      ),
    ]).map(([contactId, noteId]) => new RemoveContactNoteCommand(contactId, noteId));
  }
}
