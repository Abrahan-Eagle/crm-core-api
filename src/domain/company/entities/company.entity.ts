import {
  Address,
  Email,
  InvalidValueException,
  Nullable,
  OptionalValue,
  Phone,
  Result,
  Undefinable,
  Validator,
} from '@internal/common';

import { BufferFile, DomainErrorCode, ENTITY_TYPE, Id, Industry, Note, TaxId } from '@/domain/common';

import { CompanyDocument } from './company-document.entity';
import { CompanyMember } from './company-member.entity';

const COMPANY_NAME_MIN_LENGTH = 2;
const COMPANY_NAME_MAX_LENGTH = 100;

const COMPANY_SERVICE_MIN_LENGTH = 2;
const COMPANY_SERVICE_MAX_LENGTH = 100;

const COMPANY_DBA_MIN_LENGTH = 2;
const COMPANY_DBA_MAX_LENGTH = 100;

const COMPANY_PHONE_NUMBERS_MIN_LENGTH = 1;
const COMPANY_PHONE_NUMBERS_MAX_LENGTH = 5;

const COMPANY_CONTACT_EMAILS_MIN_LENGTH = 1;
const COMPANY_CONTACT_EMAILS_MAX_LENGTH = 5;

const COMPANY_MEMBERS_MIN_LENGTH = 1;
const COMPANY_MEMBERS_MAX_LENGTH = 10;

export const MAX_COMPANY_FILE_PER_TYPE = 4;
export const COMPANY_FILE_MAX_FILE_SIZE = 10 * 1048576;
export const COMPANY_FILE_ALLOWED_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'pdf'];

interface UpdateCompanyParams {
  companyName?: OptionalValue<string>;
  dba?: OptionalValue<Nullable<string>>;
  industry?: OptionalValue<Industry>;
  service?: OptionalValue<string>;
  creationDate?: OptionalValue<string>;
  entityType?: OptionalValue<ENTITY_TYPE>;
  address?: OptionalValue<Address>;
  phoneNumbers?: OptionalValue<Phone[]>;
  emails?: OptionalValue<Email[]>;
  members?: OptionalValue<CompanyMember[]>;
}

export class Company {
  constructor(
    public readonly id: Id,
    private _companyName: string,
    private _dba: Nullable<string>,
    public readonly taxId: TaxId,
    private _industry: Industry,
    private _service: string,
    private _creationDate: Date,
    private _entityType: ENTITY_TYPE,
    private _address: Address,
    private _phoneNumbers: Phone[],
    private _emails: Email[],
    private _members: CompanyMember[],
    private _documents: CompanyDocument[],
    private _notes: Note[],
    private _createdBy: Nullable<Id>,
    public readonly createdAt: Date,
    private _updatedAt?: Date,
    public readonly version?: number,
  ) {}

  get companyName(): string {
    return this._companyName;
  }

  get dba(): Nullable<string> {
    return this._dba;
  }

  get industry(): Industry {
    return this._industry;
  }

  get service(): string {
    return this._service;
  }

  get creationDate(): Date {
    return this._creationDate;
  }

  get entityType(): ENTITY_TYPE {
    return this._entityType;
  }

  get address(): Address {
    return this._address;
  }

  get phoneNumbers(): Phone[] {
    return this._phoneNumbers;
  }

  get emails(): Email[] {
    return this._emails;
  }

  get members(): CompanyMember[] {
    return this._members;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get documents(): CompanyDocument[] {
    return this._documents;
  }

  get notes(): Note[] {
    return this._notes;
  }

  get createdBy(): Nullable<Id> {
    return this._createdBy;
  }

  static create(
    id: Id,
    companyName: OptionalValue<string>,
    dba: OptionalValue<string>,
    taxId: TaxId,
    industry: Industry,
    service: OptionalValue<string>,
    creationDate: OptionalValue<string>,
    entityType: OptionalValue<string>,
    address: Address,
    phoneNumbers: Phone[],
    emails: Email[],
    members: CompanyMember[],
    createdBy: Nullable<Id>,
  ): Result<Company> {
    const createdAt = new Date();
    const updatedAt = new Date();
    return Result.combine({
      companyName: Company.validateCompanyName(companyName),
      dba: Company.validateDba(dba),
      industry: Result.ok(industry),
      service: Company.validateService(service),
      creationDate: Company.validateCreationDate(creationDate),
      entityType: Company.validateEntityType(entityType),
      phoneNumbers: Company.validatePhoneNumbers(phoneNumbers),
      emails: Company.validateEmails(emails),
      members: Company.validateMembersAndCheckRules(members),
    }).map(
      ({ companyName, dba, industry, service, creationDate, entityType, phoneNumbers, emails }) =>
        new Company(
          id,
          companyName,
          dba,
          taxId,
          industry,
          service,
          creationDate,
          entityType,
          address,
          phoneNumbers,
          emails,
          members,
          [],
          [],
          createdBy,
          createdAt,
          updatedAt,
        ),
    );
  }

  static validateCompanyName(companyName: OptionalValue<string>): Result<string> {
    return Validator.of(companyName)
      .required(() => DomainErrorCode.COMPANY_NAME_EMPTY)
      .string(() => DomainErrorCode.COMPANY_NAME_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.COMPANY_NAME_EMPTY)
      .minLength(COMPANY_NAME_MIN_LENGTH, () => DomainErrorCode.COMPANY_NAME_TOO_SHORT)
      .maxLength(COMPANY_NAME_MAX_LENGTH, () => DomainErrorCode.COMPANY_NAME_TOO_LONG);
  }

  static validateService(service: OptionalValue<string>): Result<string> {
    return Validator.of(service)
      .required(() => DomainErrorCode.COMPANY_SERVICE_EMPTY)
      .string(() => DomainErrorCode.COMPANY_SERVICE_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.COMPANY_SERVICE_EMPTY)
      .minLength(COMPANY_SERVICE_MIN_LENGTH, () => DomainErrorCode.COMPANY_SERVICE_TOO_SHORT)
      .maxLength(COMPANY_SERVICE_MAX_LENGTH, () => DomainErrorCode.COMPANY_SERVICE_TOO_LONG);
  }

  static validateDba(dba: OptionalValue<string>): Result<Nullable<string>> {
    return Validator.of(dba)
      .mapIfAbsent(() => null)
      .mapIfPresent((dba) =>
        Validator.of(dba)
          .string(() => DomainErrorCode.COMPANY_DBA_INVALID)
          .map((value) => value.trim())
          .notEmpty(() => DomainErrorCode.COMPANY_DBA_EMPTY)
          .minLength(COMPANY_DBA_MIN_LENGTH, () => DomainErrorCode.COMPANY_DBA_TOO_SHORT)
          .maxLength(COMPANY_DBA_MAX_LENGTH, () => DomainErrorCode.COMPANY_DBA_TOO_LONG)
          .getOrThrow(),
      );
  }

  static validateCreationDate(creationDate: OptionalValue<string>): Result<Date> {
    return Validator.of(creationDate)
      .required(() => DomainErrorCode.COMPANY_CREATION_DATE_EMPTY)
      .notEmpty(() => DomainErrorCode.COMPANY_CREATION_DATE_EMPTY)
      .datetime(() => DomainErrorCode.COMPANY_CREATION_DATE_INVALID)
      .beforeDate(new Date(), () => DomainErrorCode.COMPANY_CREATION_DATE_FUTURE);
  }

  static validateEntityType(entityType: OptionalValue<string>): Result<ENTITY_TYPE> {
    return Validator.of(entityType)
      .required(() => DomainErrorCode.COMPANY_ENTITY_TYPE_EMPTY)
      .string(() => DomainErrorCode.COMPANY_ENTITY_TYPE_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.COMPANY_ENTITY_TYPE_EMPTY)
      .map((value) => value.toUpperCase())
      .enum(ENTITY_TYPE, () => DomainErrorCode.COMPANY_ENTITY_TYPE_INVALID);
  }

  static validateMembersPercentages(members: CompanyMember[]): boolean {
    const maxDecimalPlacesRegex = /^\d+(\.\d{1,2})?$/;
    let totalPercentage = 0;

    for (let i = 0; i < members.length; i++) {
      const percentage = parseFloat(members[i].percentage.toFixed(2));

      if (!maxDecimalPlacesRegex.test(members[i].percentage.toString())) {
        return false;
      }
      totalPercentage += percentage;
    }
    return Math.round(totalPercentage).toFixed(2) === '100.00';
  }

  static validateMembersAndCheckRules(members: OptionalValue<CompanyMember[]>): Result<CompanyMember[]> {
    return Validator.of(members)
      .required(() => DomainErrorCode.COMPANY_MEMBERS_EMPTY)
      .array(() => DomainErrorCode.COMPANY_MEMBERS_INVALID)
      .notEmpty(() => DomainErrorCode.COMPANY_MEMBERS_EMPTY)
      .unique(
        (member) => member.contactId.toString(),
        () => DomainErrorCode.COMPANY_MEMBER_ID_DUPLICATED,
      )
      .validate(this.validateMembersPercentages, () => DomainErrorCode.COMPANY_MEMBERS_PERCENTAGE_INVALID)
      .minLength(COMPANY_MEMBERS_MIN_LENGTH, () => DomainErrorCode.COMPANY_MEMBERS_TOO_FEW)
      .maxLength(COMPANY_MEMBERS_MAX_LENGTH, () => DomainErrorCode.COMPANY_MEMBERS_TOO_MANY);
  }

  static validatePhoneNumbers<T>(phoneNumbers: OptionalValue<T[]>): Result<T[]> {
    return Validator.of(phoneNumbers)
      .required(() => DomainErrorCode.COMPANY_PHONE_NUMBERS_EMPTY)
      .array(() => DomainErrorCode.COMPANY_CONTACT_PHONE_NUMBERS_INVALID)
      .notEmpty(() => DomainErrorCode.COMPANY_PHONE_NUMBERS_EMPTY)
      .minLength(COMPANY_PHONE_NUMBERS_MIN_LENGTH, () => DomainErrorCode.COMPANY_CONTACT_PHONE_NUMBERS_TOO_FEW)
      .maxLength(COMPANY_PHONE_NUMBERS_MAX_LENGTH, () => DomainErrorCode.COMPANY_CONTACT_PHONE_NUMBERS_TOO_MANY);
  }

  static validateEmails<T>(emails: OptionalValue<T[]>): Result<T[]> {
    return Validator.of(emails)
      .required(() => DomainErrorCode.COMPANY_CONTACT_EMAILS_EMPTY)
      .array(() => DomainErrorCode.COMPANY_CONTACT_EMAILS_INVALID)
      .notEmpty(() => DomainErrorCode.COMPANY_CONTACT_EMAILS_EMPTY)
      .minLength(COMPANY_CONTACT_EMAILS_MIN_LENGTH, () => DomainErrorCode.COMPANY_CONTACT_EMAILS_TOO_FEW)
      .maxLength(COMPANY_CONTACT_EMAILS_MAX_LENGTH, () => DomainErrorCode.COMPANY_CONTACT_EMAILS_TOO_MANY);
  }

  public addDocument(file: BufferFile, type: OptionalValue<string>, documentName: string): Result<void> {
    const documentNameWithId = `${this.id.toString()}/${documentName}`;
    return CompanyDocument.validateType(type).flatMap((validatedType) =>
      Result.combine([
        Validator.of(this._documents.filter((doc) => doc.type === type).length + 1)
          .max(MAX_COMPANY_FILE_PER_TYPE, () => DomainErrorCode.COMPANY_MAX_FILES_PER_TYPE_EXCEEDED)
          .validate(
            () => this._documents.findIndex((document) => document.name === documentNameWithId) === -1,
            () => DomainErrorCode.FILE_DUPLICATED,
          ),
        Validator.of(this._documents.findIndex((document) => document.name === documentNameWithId) === -1).validate(
          () => true,
          () => DomainErrorCode.FILE_DUPLICATED,
        ),
        Company.validateFile(file),
      ])
        .flatMap(() =>
          CompanyDocument.create(Id.empty(), documentNameWithId, validatedType).onSuccess((document) => {
            this._documents.push(document);
            this._updatedAt = new Date();
          }),
        )
        .flatMap(() => Result.ok()),
    );
  }

  static validateFile(file: BufferFile): Result<BufferFile> {
    return Result.combine([
      CompanyDocument.validateName(file.name),
      Validator.of(file.extension)
        .required(() => DomainErrorCode.FILE_TYPE_EMPTY)
        .string(() => DomainErrorCode.FILE_TYPE_INVALID)
        .validate(
          (ext) => COMPANY_FILE_ALLOWED_EXTENSIONS.includes(ext.replaceAll('.', '')),
          () => DomainErrorCode.FILE_TYPE_INVALID,
        ),
    ]).flatMap(() => Result.ok(file));
  }

  public removeDocument(documentId: Id): Result<void> {
    const index = this._documents.findIndex((document) => document.id.equals(documentId));
    return Validator.of(index)
      .validate(
        (index) => index !== -1,
        () => new InvalidValueException(`Document ${documentId.toString()} not found in company ${this.id.toString()}`),
      )
      .map(() => void 0)
      .onSuccess(() => {
        this._documents.splice(index, 1);
        this._updatedAt = new Date();
      });
  }

  public updateCompany(update: UpdateCompanyParams, now = new Date()): Result<void> {
    return Result.combine([
      update.companyName ? this.updateCompanyName(update.companyName, now) : Result.ok(),
      update.dba ? this.updateDba(update.dba, now) : Result.ok(),
      update.industry ? this.updateIndustry(update.industry, now) : Result.ok(),
      update.service ? this.updateService(update.service, now) : Result.ok(),
      update.creationDate ? this.updateCreationDate(update.creationDate, now) : Result.ok(),
      update.entityType ? this.updateEntityType(update.entityType, now) : Result.ok(),
      update.address ? this.updateAddress(update.address, now) : Result.ok(),
      update.phoneNumbers ? this.updatePhoneNumbers(update.phoneNumbers, now) : Result.ok(),
      update.emails ? this.updateEmails(update.emails, now) : Result.ok(),
      update.members ? this.updateMembers(update.members, now) : Result.ok(),
    ]).flatMap(() => Result.ok());
  }

  public updateCompanyName(companyName: OptionalValue<string>, now = new Date()): Result<void> {
    return Company.validateCompanyName(companyName)
      .onSuccess((validated) => {
        this._companyName = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateDba(dba: OptionalValue<Nullable<string>>, now = new Date()): Result<void> {
    return Company.validateDba(dba)
      .onSuccess((validated) => {
        this._dba = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateIndustry(industry: Industry, now = new Date()): Result<void> {
    return Result.ok()
      .onSuccess(() => {
        this._industry = industry;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateService(service: OptionalValue<string>, now = new Date()): Result<void> {
    return Company.validateService(service)
      .onSuccess((validated) => {
        this._service = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateCreationDate(creationDate: OptionalValue<string>, now = new Date()): Result<void> {
    return Company.validateCreationDate(creationDate)
      .onSuccess((validated) => {
        this._creationDate = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateEntityType(entityType: OptionalValue<ENTITY_TYPE>, now = new Date()): Result<void> {
    return Company.validateEntityType(entityType)
      .onSuccess((validated) => {
        this._entityType = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateAddress(address: Address, now = new Date()): Result<void> {
    return Result.ok()
      .onSuccess(() => {
        this._address = address;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updatePhoneNumbers(phoneNumbers: Phone[], now = new Date()): Result<void> {
    return Company.validatePhoneNumbers(phoneNumbers)
      .onSuccess((validated) => {
        this._phoneNumbers = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateEmails(emails: OptionalValue<Email[]>, now = new Date()): Result<void> {
    return Company.validateEmails(emails)
      .onSuccess((validated) => {
        this._emails = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateMembers(members: OptionalValue<CompanyMember[]>, now = new Date()): Result<void> {
    return Company.validateMembersAndCheckRules(members)
      .onSuccess((validated) => {
        this._members = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
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

  public removeNote(noteId: Id): Result<void> {
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

  public transfer(userId: Id): Result<void> {
    return Result.ok().onSuccess(() => {
      this._createdBy = userId;
      this._updatedAt = new Date();
    });
  }
}
