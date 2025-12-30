import {
  AggregateRoot,
  BadRequest,
  InvalidValueException,
  Nullable,
  OptionalValue,
  Phone,
  Result,
  Undefinable,
  Validator,
} from '@internal/common';

import { DomainErrorCode, Id, Note } from '@/domain/common';

import { CallLog } from './call-log.entity';

export class Prospect extends AggregateRoot {
  protected constructor(
    public readonly id: Id,
    public readonly leadGoupId: Id,
    public readonly company: Nullable<string>,
    public readonly name: string,
    public readonly email: Nullable<string>,
    public readonly phone: Phone,
    private _notes: Note[],
    private _callHistory: CallLog[],
    private _followUpCall: Nullable<Date>,
    private _updatedAt?: Date,
  ) {
    super();
  }

  get followUpCall(): Nullable<Date> {
    return this._followUpCall;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  public get notes(): Note[] {
    return this._notes;
  }

  public get callHistory(): CallLog[] {
    return this._callHistory;
  }

  public get lastCall(): Nullable<Date> {
    return (
      this.callHistory
        .sort(function (a, b) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .at(0)?.createdAt || null
    );
  }

  static create(
    id: Id,
    leadGoupId: Id,
    company: OptionalValue<string>,
    name: OptionalValue<string>,
    email: OptionalValue<string>,
    phone: Phone,
  ): Result<Prospect> {
    return Result.combine([this.validateCompany(company), this.validateName(name), this.validateEmail(email)]).map(
      ([company, name, email]) => new Prospect(id, leadGoupId, company, name, email, phone, [], [], null),
    );
  }

  static validateCompany(company: OptionalValue<string>): Result<Nullable<string>> {
    return Validator.of(company)
      .string(() => new BadRequest(DomainErrorCode.PROSPECT_COMPANY_INVALID))
      .minLength(0, () => new BadRequest(DomainErrorCode.PROSPECT_COMPANY_TOO_SHORT))
      .maxLength(50, () => new BadRequest(DomainErrorCode.PROSPECT_COMPANY_TOO_LONG))
      .mapIfAbsent(() => null);
  }

  static validateName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => new BadRequest(DomainErrorCode.PROSPECT_NAME_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.PROSPECT_NAME_INVALID))
      .minLength(2, () => new BadRequest(DomainErrorCode.PROSPECT_NAME_TOO_SHORT))
      .maxLength(50, () => new BadRequest(DomainErrorCode.PROSPECT_NAME_TOO_LONG));
  }

  static validateEmail(email: OptionalValue<string>): Result<Nullable<string>> {
    return Validator.of(email)
      .email(() => new BadRequest(DomainErrorCode.PROSPECT_EMAIL_INVALID))
      .mapIfAbsent(() => null)
      .mapIfPresent((value) => value.toLowerCase());
  }

  public addCallLog(callLog: CallLog): Result<void> {
    return Result.ok().onSuccess(() => {
      this._callHistory.unshift(callLog);
      this._updatedAt = new Date();
    });
  }

  public addNote(note: Note): Result<void> {
    return Validator.of([note, ...this._notes])
      .unique(
        (note) => note.id.toString(),
        () => DomainErrorCode.NOTE_IS_DUPLICATED,
      )
      .onSuccess((updated) => {
        this._notes = updated;
        this._updatedAt = new Date();
      })
      .map(() => void 0);
  }

  public updateFollowUpCall(reminder: Date): Result<void> {
    return Result.ok().onSuccess(() => {
      this._followUpCall = reminder;
    });
  }

  public removeNote(noteId: Id) {
    const index = this._notes.findIndex((note) => note.id.equals(noteId));
    return Validator.of(index)
      .validate(
        (index) => index !== -1,
        () => new InvalidValueException(`Note ${noteId.toString()} not found in company ${this.id.toString()}`),
      )
      .map(() => void 0)
      .onSuccess(() => {
        this._notes.splice(index, 1);
        this._updatedAt = new Date();
      });
  }
}
