import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id, Note } from '@/domain/common';

export class AddContactNoteCommand {
  private constructor(
    public readonly contactId: Id,
    public readonly note: Note,
  ) {}

  static create(
    userId: Id,
    contactId: OptionalValue<string>,
    noteId: OptionalValue<string>,
    level: OptionalValue<string>,
    description: OptionalValue<string>,
  ): Result<AddContactNoteCommand> {
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
    ])
      .flatMap(([contactId, noteId]) =>
        Result.combine([Result.ok(contactId), Note.create(noteId, userId, level, description)]),
      )
      .map(([contact, note]) => new AddContactNoteCommand(contact, note));
  }
}
