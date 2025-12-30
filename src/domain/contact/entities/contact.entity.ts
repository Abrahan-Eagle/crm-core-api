import {
  Address,
  Email,
  Id,
  InvalidValueException,
  Nullable,
  ObjectId,
  OptionalValue,
  Phone,
  Result,
  Undefinable,
  Validator,
} from '@internal/common';

import { BufferFile, DomainErrorCode, Note } from '@/domain/common';
import { getDateYearsAgo } from '@/domain/common/utils';

import { ContactDocument, SUPPORTED_CONTACT_FILES } from './contact-document.entity';

const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 50;
const LAST_NAME_MIN_LENGTH = 2;
const LAST_NAME_MAX_LENGTH = 50;
const EMAILS_MAX_LENGTH = 3;
const PHONES_MAX_LENGTH = 3;
const MIN_AGE = 21;

export const MAX_CONTACT_FILE_PER_TYPE = 4;

export const CONTACT_FILE_ALLOWED_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'pdf'];

export const CONTACT_FILE_MAX_FILE_SIZE = 10 * 1048576;

export enum CONTACT_IDENTIFICATION_TYPE {
  ITIN = 'ITIN',
  SSN = 'SSN',
}

export interface UpdateContactParams {
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  birthdate?: Nullable<string>;
  ssn?: Nullable<string>;
  address?: Nullable<Address>;
  phones?: Nullable<Phone[]>;
  emails?: Nullable<Email[]>;
}

export class Contact {
  constructor(
    public readonly id: Id,
    private _firstName: string,
    private _lastName: string,
    private _birthdate: Date,
    public readonly ssn: string,
    private _address: Address,
    private _phones: Phone[],
    private _emails: Email[],
    private _documents: ContactDocument[],
    private _notes: Note[],
    public readonly createdBy: Nullable<Id>,
    public readonly createdAt: Date,
    private _updatedAt?: Date,
    public readonly version?: number,
  ) {}

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get birthdate(): Date {
    return this._birthdate;
  }

  get address(): Address {
    return this._address;
  }

  get phones(): Phone[] {
    return this._phones;
  }

  get emails(): Email[] {
    return this._emails;
  }

  get notes(): Note[] {
    return this._notes;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get documents(): ContactDocument[] {
    return this._documents;
  }

  get identificationType(): CONTACT_IDENTIFICATION_TYPE {
    return /^9/.test(this.ssn) ? CONTACT_IDENTIFICATION_TYPE.ITIN : CONTACT_IDENTIFICATION_TYPE.SSN;
  }

  static create(
    id: Id,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    birthdate: OptionalValue<string>,
    ssn: OptionalValue<string>,
    address: Address,
    phones: Phone[],
    emails: Email[],
    createdBy: Nullable<Id>,
  ): Result<Contact> {
    const updatedAt = new Date();
    const createdAt = new Date();
    return Result.combine({
      firstName: Contact.validateFirstName(firstName),
      lastName: Contact.validateLastName(lastName),
      ssn: Contact.validateSSN(ssn),
      birthdate: Contact.validateBirthdate(birthdate),
      phones: Contact.validatePhonesLength(phones),
      emails: Contact.validateEmailsLength(emails),
    }).map(
      ({ firstName, lastName, ssn, birthdate }) =>
        new Contact(
          id,
          firstName,
          lastName,
          birthdate,
          ssn,
          address,
          phones,
          emails,
          [],
          [],
          createdBy,
          createdAt,
          updatedAt,
        ),
    );
  }

  public updateContact(update: UpdateContactParams, now = new Date()): Result<void> {
    return Result.combine([
      update.firstName ? this.updateFirstName(update.firstName, now) : Result.ok(),
      update.lastName ? this.updateLastName(update.lastName, now) : Result.ok(),
      update.birthdate ? this.updateBirthdate(update.birthdate, now) : Result.ok(),
      update.address ? this.updateAddress(update.address, now) : Result.ok(),
      update.phones ? this.updatePhones(update.phones, now) : Result.ok(),
      update.emails ? this.updateEmails(update.emails, now) : Result.ok(),
    ]).flatMap(() => Result.ok());
  }

  private updateFirstName(firstName: OptionalValue<string>, now = new Date()): Result<void> {
    return Contact.validateFirstName(firstName)
      .onSuccess((validated) => {
        this._firstName = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updateLastName(lastName: OptionalValue<string>, now = new Date()): Result<void> {
    return Contact.validateLastName(lastName)
      .onSuccess((validated) => {
        this._lastName = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updateBirthdate(birthdate: OptionalValue<string>, now = new Date()): Result<void> {
    return Contact.validateBirthdate(birthdate)
      .onSuccess((validated) => {
        this._birthdate = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updateAddress(address: OptionalValue<Address>, now = new Date()): Result<void> {
    return Validator.of(address)
      .required(() => DomainErrorCode.CONTACT_ADDRESS_EMPTY)
      .onSuccess((validated) => {
        this._address = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updatePhones(phones: OptionalValue<Phone[]>, now = new Date()): Result<void> {
    return Contact.validatePhonesLength(phones)
      .onSuccess((validated) => {
        this._phones = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  private updateEmails(emails: OptionalValue<Email[]>, now = new Date()): Result<void> {
    return Contact.validateEmailsLength(emails)
      .onSuccess((validated) => {
        this._emails = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  static validateFirstName(firstName: OptionalValue<string>): Result<string> {
    return Validator.of(firstName)
      .required(() => DomainErrorCode.FIRST_NAME_EMPTY)
      .string(() => DomainErrorCode.FIRST_NAME_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.FIRST_NAME_EMPTY)
      .minLength(FIRST_NAME_MIN_LENGTH, () => DomainErrorCode.CONTACT_FIRST_NAME_TOO_SHORT)
      .maxLength(FIRST_NAME_MAX_LENGTH, () => DomainErrorCode.CONTACT_FIRST_NAME_TOO_LONG);
  }

  static validateLastName(lastName: OptionalValue<string>): Result<string> {
    return Validator.of(lastName)
      .required(() => DomainErrorCode.LAST_NAME_EMPTY)
      .string(() => DomainErrorCode.LAST_NAME_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.LAST_NAME_EMPTY)
      .minLength(LAST_NAME_MIN_LENGTH, () => DomainErrorCode.CONTACT_LAST_NAME_TOO_SHORT)
      .maxLength(LAST_NAME_MAX_LENGTH, () => DomainErrorCode.CONTACT_LAST_NAME_TOO_LONG);
  }

  static validateSSN(ssn: OptionalValue<string>): Result<string> {
    return Validator.of(ssn)
      .required(() => DomainErrorCode.CONTACT_SSN_EMPTY)
      .string(() => DomainErrorCode.CONTACT_SSN_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.CONTACT_SSN_EMPTY)
      .regex(/^\d{3}-\d{2}-\d{4}$/, () => DomainErrorCode.CONTACT_SSN_INVALID);
  }

  static validateBirthdate(birthdate: OptionalValue<string>): Result<Date> {
    return Validator.of(birthdate)
      .required(() => DomainErrorCode.CONTACT_BIRTHDATE_EMPTY)
      .string(() => DomainErrorCode.CONTACT_BIRTHDATE_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.CONTACT_BIRTHDATE_EMPTY)
      .datetime(() => DomainErrorCode.CONTACT_BIRTHDATE_INVALID)
      .beforeDate(getDateYearsAgo(MIN_AGE), () => DomainErrorCode.CONTACT_BIRTHDATE_TOO_YOUNG);
  }

  static validateEmailsLength(emails: OptionalValue<Email[]>): Result<Email[]> {
    return Validator.of(emails)
      .required(() => DomainErrorCode.CONTACT_EMAILS_EMPTY)
      .maxLength(EMAILS_MAX_LENGTH, () => DomainErrorCode.CONTACT_EMAILS_LIMIT_EXCEEDED);
  }

  static validatePhonesLength(phones: OptionalValue<Phone[]>): Result<Phone[]> {
    return Validator.of(phones)
      .required(() => DomainErrorCode.CONTACT_PHONES_EMPTY)
      .maxLength(PHONES_MAX_LENGTH, () => DomainErrorCode.CONTACT_PHONES_LIMIT_EXCEEDED);
  }

  static validateFile(file: BufferFile): Result<BufferFile> {
    return Result.combine([
      ContactDocument.validateName(file.name),
      Validator.of(file.extension)
        .required(() => DomainErrorCode.FILE_TYPE_EMPTY)
        .string(() => DomainErrorCode.FILE_TYPE_INVALID)
        .validate(
          (ext) => CONTACT_FILE_ALLOWED_EXTENSIONS.includes(ext.replaceAll('.', '')),
          () => DomainErrorCode.FILE_TYPE_INVALID,
        ),
    ]).flatMap(() => Result.ok(file));
  }

  public addDocument(file: BufferFile, type: SUPPORTED_CONTACT_FILES, documentName: string): Result<void> {
    const documentNameWithId = `${this.id.toString()}/${documentName}`;
    return Result.combine([
      Validator.of(this._documents.filter((doc) => doc.type === type).length + 1)
        .max(MAX_CONTACT_FILE_PER_TYPE, () => DomainErrorCode.CONTACT_MAX_FILES_PER_TYPE_EXCEEDED)
        .validate(
          () => this._documents.findIndex((document) => document.name === documentNameWithId) === -1,
          () => DomainErrorCode.FILE_DUPLICATED,
        ),
      Contact.validateFile(file),
    ])
      .flatMap(() =>
        ContactDocument.create(Id.empty(), documentNameWithId, type).onSuccess((document) => {
          this._documents.push(document);
          this._updatedAt = new Date();
        }),
      )
      .flatMap(() => Result.ok());
  }

  public removeDocument(documentId: ObjectId) {
    const index = this._documents.findIndex((document) => document.id.equals(documentId));
    return Validator.of(index)
      .validate(
        (index) => index !== -1,
        () => new InvalidValueException(`Document ${documentId.toString()} not found in contact ${this.id.toString()}`),
      )
      .map(() => void 0)
      .onSuccess(() => {
        this._documents.splice(index, 1);
        this._updatedAt = new Date();
      });
  }

  public addNote(note: Note): Result<void> {
    return Validator.of([...this._notes, note])
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

  public removeNote(noteId: Id) {
    const index = this._notes.findIndex((note) => note.id.equals(noteId));
    return Validator.of(index)
      .validate(
        (index) => index !== -1,
        () => new InvalidValueException(`Note ${noteId.toString()} not found in contact ${this.id.toString()}`),
      )
      .map(() => void 0)
      .onSuccess(() => {
        this._notes.splice(index, 1);
        this._updatedAt = new Date();
      });
  }
}
