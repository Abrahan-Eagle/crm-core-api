import { Nullable, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id, Note, NOTE_LEVEL } from '@/domain/common';

export class AddNoteToProspectCommand {
  private constructor(
    public readonly leadId: Id,
    public readonly prospectId: Id,
    public readonly note: Note,
    public readonly followUpCall: Nullable<Date>,
  ) {}

  static create(
    userId: Id,
    leadId: OptionalValue<string>,
    prospectId: OptionalValue<string>,
    noteId: OptionalValue<string>,
    description: OptionalValue<string>,
    followUpCall?: OptionalValue<string>,
  ): Result<AddNoteToProspectCommand> {
    return Result.combine([
      Id.create(
        leadId,
        () => DomainErrorCode.LEAD_ID_EMPTY,
        () => DomainErrorCode.LEAD_ID_INVALID,
      ),
      Id.create(
        prospectId,
        () => DomainErrorCode.PROSPECT_ID_EMPTY,
        () => DomainErrorCode.PROSPECT_ID_INVALID,
      ),
      Id.create(
        noteId,
        () => DomainErrorCode.NOTE_ID_EMPTY,
        () => DomainErrorCode.NOTE_ID_INVALID,
      ),
    ])
      .flatMap(([leadId, prospectId, noteId]) =>
        Result.combine([
          Result.ok(leadId),
          Result.ok(prospectId),
          Note.create(noteId, userId, NOTE_LEVEL.INFO.toString(), description),
          followUpCall !== undefined
            ? Validator.of(followUpCall)
                .required(() => DomainErrorCode.FOLLOW_UP_CALL_EMPTY)
                .datetime(() => DomainErrorCode.FOLLOW_UP_CALL_INVALID)
                .afterDate(new Date(), () => DomainErrorCode.FOLLOW_UP_CALL_INVALID)
            : Result.ok(null),
        ]),
      )
      .map(
        ([leadId, prospectId, note, followUpCall]) =>
          new AddNoteToProspectCommand(leadId, prospectId, note, followUpCall),
      );
  }
}
