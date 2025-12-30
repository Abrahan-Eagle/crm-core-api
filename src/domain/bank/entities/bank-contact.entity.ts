import { Email, OptionalValue, Phone, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '@/domain/common';

export const BANK_MAX_EMAIL_PER_CONTACT = 3;
export const BANK_MAX_PHONE_PER_CONTACT = 3;
export const BANK_MIN_EMAIL_PER_CONTACT = 1;
export const BANK_MIN_PHONE_PER_CONTACT = 1;

export class BankContact {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phones: Phone[],
    public readonly emails: Email[],
  ) {}

  static validateFirstName(firstName: OptionalValue<string>): Result<string> {
    return Validator.of(firstName)
      .required(() => DomainErrorCode.BANK_CONTACT_FIRST_NAME_EMPTY)
      .string(() => DomainErrorCode.BANK_CONTACT_FIRST_NAME_INVALID)
      .notEmpty(() => DomainErrorCode.BANK_CONTACT_FIRST_NAME_EMPTY);
  }

  static validateLastName(lastName: OptionalValue<string>): Result<string> {
    return Validator.of(lastName)
      .required(() => DomainErrorCode.BANK_CONTACT_LAST_NAME_EMPTY)
      .string(() => DomainErrorCode.BANK_CONTACT_LAST_NAME_INVALID)
      .notEmpty(() => DomainErrorCode.BANK_CONTACT_LAST_NAME_EMPTY);
  }

  static create(
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    phones: OptionalValue<Phone[]>,
    emails: OptionalValue<Email[]>,
  ): Result<BankContact> {
    return Result.combine([
      this.validateFirstName(firstName),
      this.validateLastName(lastName),
      this.validatePhoneNumbers(phones),
      this.validateEmails(emails),
    ]).map((params) => new BankContact(...params));
  }

  static validatePhoneNumbers(phones: OptionalValue<Phone[]>): Result<Phone[]> {
    return Validator.of(phones)
      .array(() => DomainErrorCode.BANK_CONTACTS_PHONES_EMPTY)
      .required(() => DomainErrorCode.BANK_CONTACTS_PHONES_EMPTY)
      .minLength(BANK_MIN_PHONE_PER_CONTACT, () => DomainErrorCode.BANK_CONTACT_TOO_FEW_PHONES)
      .maxLength(BANK_MAX_PHONE_PER_CONTACT, () => DomainErrorCode.BANK_CONTACT_TOO_MANY_PHONES);
  }

  static validateEmails(emails: OptionalValue<Email[]>): Result<Email[]> {
    return Validator.of(emails)
      .array(() => DomainErrorCode.BANK_CONTACTS_EMAILS_EMPTY)
      .required(() => DomainErrorCode.BANK_CONTACTS_EMAILS_EMPTY)
      .minLength(BANK_MIN_EMAIL_PER_CONTACT, () => DomainErrorCode.BANK_CONTACT_TOO_FEW_EMAILS)
      .maxLength(BANK_MAX_EMAIL_PER_CONTACT, () => DomainErrorCode.BANK_CONTACT_TOO_MANY_EMAILS);
  }
}
