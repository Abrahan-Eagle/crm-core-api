import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id, Note } from '@/domain/common';

export class AddCompanyNoteCommand {
  private constructor(
    public readonly companyId: Id,
    public readonly note: Note,
  ) {}

  static create(
    userId: Id,
    companyId: OptionalValue<string>,
    noteId: OptionalValue<string>,
    level: OptionalValue<string>,
    description: OptionalValue<string>,
  ): Result<AddCompanyNoteCommand> {
    return Result.combine([
      Id.create(
        companyId,
        () => DomainErrorCode.COMPANY_ID_EMPTY,
        () => DomainErrorCode.COMPANY_ID_INVALID,
      ),
      Id.create(
        noteId,
        () => DomainErrorCode.NOTE_ID_EMPTY,
        () => DomainErrorCode.NOTE_ID_INVALID,
      ),
    ])
      .flatMap(([companyId, noteId]) =>
        Result.combine([Result.ok(companyId), Note.create(noteId, userId, level, description)]),
      )
      .map(([contact, note]) => new AddCompanyNoteCommand(contact, note));
  }
}
