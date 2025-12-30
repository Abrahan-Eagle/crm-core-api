import {
  Address,
  InvalidValueException,
  Nullable,
  OptionalValue,
  Result,
  Undefinable,
  Validator,
} from '@internal/common';

import { BufferFile, DomainErrorCode, Id } from '@/domain/common';

import { BankBlacklist } from './bank-blacklist.entity';
import { BankConstraints } from './bank-constraints.entity';
import { BankContact } from './bank-contact.entity';
import { BankDocument } from './bank-document.entity';

const BANK_MANAGER_MIN_LENGTH = 3;
const BANK_MANAGER_MAX_LENGTH = 100;

export const BANK_MAX_FILES = 6;

export const BANK_MIN_CONTACTS = 1;
export const BANK_MAX_CONTACTS = 6;

export const BANK_FILE_MAX_FILE_SIZE = 10 * 1048576;
export const BANK_FILE_ALLOWED_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'pdf'];

export enum BANK_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum BANK_TYPE {
  LENDER = 'lender',
  BROKER = 'broker',
}

export type UpdateBankParams = {
  bankName?: Nullable<string>;
  bankType?: Nullable<string>;
  manager?: Nullable<string>;
  address?: Nullable<Address>;
  contacts?: Nullable<BankContact[]>;
  constraints?: Nullable<BankConstraints>;
};

export class Bank {
  constructor(
    public readonly id: Id,
    private _bankName: string,
    private _manager: string,
    private _status: BANK_STATUS,
    private _address: Address,
    private _contacts: BankContact[],
    private _constraints: BankConstraints,
    private _documents: BankDocument[],
    private _bankType: BANK_TYPE,
    private _blacklist: Nullable<BankBlacklist>,
    public readonly createdAt: Date,
    private _updatedAt?: Date,
    public readonly version?: number,
  ) {}

  isActive(): boolean {
    return this._status === BANK_STATUS.ACTIVE && this._blacklist === null;
  }

  canBeRemovedFromBlacklist(): boolean {
    return this._status === BANK_STATUS.ACTIVE;
  }

  canBeBlacklisted(): boolean {
    return this._status === BANK_STATUS.ACTIVE && this._blacklist === null;
  }

  get bankName(): string {
    return this._bankName;
  }

  get manager(): string {
    return this._manager;
  }

  get status(): BANK_STATUS {
    return this._status;
  }

  get address(): Address {
    return this._address;
  }

  get contacts(): BankContact[] {
    return this._contacts;
  }

  get constraints(): BankConstraints {
    return this._constraints;
  }

  get documents(): BankDocument[] {
    return this._documents;
  }

  get bankType(): BANK_TYPE {
    return this._bankType;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get blacklist(): Nullable<BankBlacklist> {
    return this._blacklist;
  }

  static create(
    id: Id,
    bankName: OptionalValue<string>,
    manager: OptionalValue<string>,
    address: Address,
    contacts: BankContact[],
    bankType: OptionalValue<string>,
    constraints: BankConstraints,
  ): Result<Bank> {
    const createdAt = new Date();
    const updatedAt = new Date();

    return Result.combine({
      bankName: Bank.validateBankName(bankName),
      manager: Bank.validateManager(manager),
      bankType: Bank.validateBankType(bankType),
    }).map(
      ({ bankName, manager, bankType }) =>
        new Bank(
          id,
          bankName,
          manager,
          BANK_STATUS.ACTIVE,
          address,
          contacts,
          constraints,
          [],
          bankType,
          null,
          createdAt,
          updatedAt,
        ),
    );
  }

  updateBank(update: UpdateBankParams, now = new Date()): Result<void> {
    return Result.combine([
      update.bankName ? this.updateBankName(update.bankName, now) : Result.ok(),
      update.bankType ? this.updateBankType(update.bankType, now) : Result.ok(),
      update.manager ? this.updateManager(update.manager, now) : Result.ok(),
      update.contacts ? this.updateContacts(update.contacts, now) : Result.ok(),
      update.address ? this.updateAddress(update.address, now) : Result.ok(),
      update.constraints ? this.updateConstraints(update.constraints, now) : Result.ok(),
    ]).flatMap(() => Result.ok());
  }

  public updateBankName(bankName: OptionalValue<string>, now = new Date()): Result<void> {
    return Bank.validateBankName(bankName)
      .onSuccess((validated) => {
        this._bankName = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateBankType(bankType: OptionalValue<string>, now = new Date()): Result<void> {
    return Bank.validateBankType(bankType)
      .onSuccess((validated) => {
        this._bankType = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateManager(manager: OptionalValue<string>, now = new Date()): Result<void> {
    return Bank.validateManager(manager)
      .onSuccess((validated) => {
        this._manager = validated;
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

  public updateContacts(contacts: OptionalValue<BankContact[]>, now = new Date()): Result<void> {
    return Bank.validateContacts(contacts)
      .onSuccess((validated) => {
        this._contacts = validated;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  public updateConstraints(constraints: BankConstraints, now = new Date()): Result<void> {
    return Result.ok()
      .onSuccess(() => {
        this._constraints = constraints;
        this._updatedAt = now;
      })
      .flatMap(() => Result.ok());
  }

  setBlacklisted(blacklist: BankBlacklist, now = new Date()): Result<void> {
    return Validator.of(this._blacklist)
      .validate(
        () => this._blacklist === null,
        () => DomainErrorCode.BANK_IS_ALREADY_BLACKLISTED,
      )
      .flatMap(() => Result.ok())
      .onSuccess(() => {
        this._blacklist = blacklist;
        this._updatedAt = now;
      });
  }

  removeFromBlacklist(now = new Date()): Result<void> {
    return Validator.of({})
      .validate(
        () => this._blacklist !== null,
        () => DomainErrorCode.BANK_IS_NOT_BLACKLISTED,
      )
      .flatMap(() => Result.ok())
      .onSuccess(() => {
        this._blacklist = null;
        this._updatedAt = now;
      });
  }

  static validateManager(manager: OptionalValue<string>): Result<string> {
    return Validator.of(manager)
      .required(() => DomainErrorCode.BANK_MANAGER_EMPTY)
      .string(() => DomainErrorCode.BANK_MANAGER_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.BANK_MANAGER_EMPTY)
      .minLength(BANK_MANAGER_MIN_LENGTH, () => DomainErrorCode.BANK_MANAGER_TOO_SHORT)
      .maxLength(BANK_MANAGER_MAX_LENGTH, () => DomainErrorCode.BANK_MANAGER_TOO_LONG);
  }

  static validateBankType(bankType: OptionalValue<string>): Result<BANK_TYPE> {
    return Validator.of(bankType)
      .required(() => DomainErrorCode.BANK_TYPE_EMPTY)
      .string(() => DomainErrorCode.BANK_TYPE_INVALID)
      .map((value) => value.trim())
      .enum(BANK_TYPE, () => DomainErrorCode.BANK_TYPE_INVALID) as Result<BANK_TYPE>;
  }

  static validateBankName(bankName: OptionalValue<string>): Result<string> {
    return Validator.of(bankName)
      .required(() => DomainErrorCode.BANK_NAME_EMPTY)
      .string(() => DomainErrorCode.BANK_NAME_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.BANK_NAME_EMPTY)
      .minLength(BANK_MANAGER_MIN_LENGTH, () => DomainErrorCode.BANK_NAME_TOO_SHORT)
      .maxLength(BANK_MANAGER_MAX_LENGTH, () => DomainErrorCode.BANK_NAME_TOO_LONG);
  }

  static validateContacts(contacts: OptionalValue<BankContact[]>): Result<BankContact[]> {
    return Validator.of(contacts)
      .required(() => DomainErrorCode.BANK_CONTACTS_EMPTY)
      .array(() => DomainErrorCode.BANK_CONTACTS_INVALID)
      .minLength(BANK_MIN_CONTACTS, () => DomainErrorCode.BANK_CONTACTS_INVALID_SIZE)
      .maxLength(BANK_MAX_CONTACTS, () => DomainErrorCode.BANK_CONTACTS_INVALID_SIZE);
  }

  public addDocument(file: BufferFile): Result<void> {
    return Result.combine([
      Validator.of(this._documents.length + 1)
        .max(BANK_MAX_FILES, () => DomainErrorCode.BANK_MAX_FILES_EXCEEDED)
        .validate(
          () => this._documents.findIndex((document) => document.name === file.name) === -1,
          () => DomainErrorCode.FILE_DUPLICATED,
        ),
      Bank.validateFile(file),
    ])
      .flatMap(() =>
        BankDocument.create(Id.empty(), file.name).onSuccess((document) => {
          this._documents.push(document);
          this._updatedAt = new Date();
        }),
      )
      .flatMap(() => Result.ok());
  }

  static validateFile(file: BufferFile): Result<BufferFile> {
    return Result.combine([
      BankDocument.validateName(file.name),
      Validator.of(file.extension)
        .required(() => DomainErrorCode.FILE_TYPE_EMPTY)
        .string(() => DomainErrorCode.FILE_TYPE_INVALID)
        .validate(
          (ext) => BANK_FILE_ALLOWED_EXTENSIONS.includes(ext.replaceAll('.', '')),
          () => DomainErrorCode.FILE_TYPE_INVALID,
        ),
    ]).flatMap(() => Result.ok(file));
  }

  static validateStatus(status: OptionalValue<string>): Result<BANK_STATUS> {
    return Validator.of(status)
      .required(() => DomainErrorCode.BANK_STATUS_EMPTY)
      .string(() => DomainErrorCode.BANK_STATUS_INVALID)
      .map((value) => value.trim())
      .enum(BANK_STATUS, () => DomainErrorCode.BANK_STATUS_INVALID) as Result<BANK_STATUS>;
  }

  public removeDocument(documentId: Id): Result<void> {
    const index = this._documents.findIndex((document) => document.id.equals(documentId));
    return Validator.of(index)
      .validate(
        (index) => index !== -1,
        () => new InvalidValueException(`Document ${documentId.toString()} not found in bank ${this.id.toString()}`),
      )
      .map(() => void 0)
      .onSuccess(() => {
        this._documents.splice(index, 1);
        this._updatedAt = new Date();
      });
  }
}
