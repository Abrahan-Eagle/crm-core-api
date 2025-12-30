import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

const NOTE_MIN_LENGTH = 1;
const NOTE_MAX_LENGTH = 500;

export class BankBlacklist {
  constructor(
    public readonly blacklistedAt: Date,
    public readonly blacklistedBy: Id,
    public readonly note: string,
  ) {}

  static create(blacklistedBy: Id, note: OptionalValue<string>, blacklistedAt?: Date): Result<BankBlacklist> {
    const timestamp = blacklistedAt || new Date();

    return BankBlacklist.validateNote(note).map(
      (validatedNote) => new BankBlacklist(timestamp, blacklistedBy, validatedNote),
    );
  }

  static validateNote(note: OptionalValue<string>): Result<string> {
    return Validator.of(note)
      .required(() => DomainErrorCode.BANK_BLACKLIST_NOTE_EMPTY)
      .string(() => DomainErrorCode.BANK_BLACKLIST_NOTE_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.BANK_BLACKLIST_NOTE_EMPTY)
      .minLength(NOTE_MIN_LENGTH, () => DomainErrorCode.BANK_BLACKLIST_NOTE_TOO_SHORT)
      .maxLength(NOTE_MAX_LENGTH, () => DomainErrorCode.BANK_BLACKLIST_NOTE_TOO_LONG);
  }
}
