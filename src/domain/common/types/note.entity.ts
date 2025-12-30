import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '../errors';
import { Id } from './id';

export enum NOTE_LEVEL {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

const DESCRIPTION_MIN_LENGTH = 5;
const DESCRIPTION_MAX_LENGTH = 1000;

export class Note {
  constructor(
    public readonly id: Id,
    public readonly author: Id,
    public readonly level: NOTE_LEVEL,
    private _description: string,
    public readonly createdAt: Date,
  ) {}

  get description(): string {
    return this._description;
  }

  static create(id: Id, author: Id, level: OptionalValue<string>, description: OptionalValue<string>): Result<Note> {
    return Result.combine([this.validateLevel(level), this.validateDescription(description)]).map(
      ([level, description]) => new Note(id, author, level, description, new Date()),
    );
  }

  static validateLevel(level: OptionalValue<string>): Result<NOTE_LEVEL> {
    return Validator.of(level)
      .required(() => DomainErrorCode.NOTE_LEVEL_EMPTY)
      .string(() => DomainErrorCode.NOTE_LEVEL_INVALID)
      .map((type) => type.trim())
      .enum(NOTE_LEVEL, () => DomainErrorCode.NOTE_LEVEL_INVALID);
  }

  static validateDescription(description: OptionalValue<string>): Result<string> {
    return Validator.of(description)
      .required(() => DomainErrorCode.NOTE_DESCRIPTION_EMPTY)
      .string(() => DomainErrorCode.NOTE_DESCRIPTION_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.NOTE_DESCRIPTION_EMPTY)
      .minLength(DESCRIPTION_MIN_LENGTH, () => DomainErrorCode.NOTE_DESCRIPTION_TOO_SHORT)
      .maxLength(DESCRIPTION_MAX_LENGTH, () => DomainErrorCode.NOTE_DESCRIPTION_TOO_LONG);
  }
}
