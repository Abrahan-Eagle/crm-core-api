import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class RemoveCompanyNoteCommand {
  private constructor(
    public readonly companyId: Id,
    public readonly noteId: Id,
  ) {}

  static create(companyId: OptionalValue<string>, noteId: OptionalValue<string>): Result<RemoveCompanyNoteCommand> {
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
    ]).map(([companyId, noteId]) => new RemoveCompanyNoteCommand(companyId, noteId));
  }
}
