import { Address, Email, Nullable, OptionalValue, Phone, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Contact } from '../entities';

type CreatePhoneRequest = {
  intlPrefix?: OptionalValue<string>;
  regionCode?: OptionalValue<string>;
  number?: OptionalValue<string>;
};

type CreateAddressRequest = {
  addressLine1?: OptionalValue<string>;
  addressLine2?: OptionalValue<string>;
  state?: OptionalValue<string>;
  city?: OptionalValue<string>;
  zipCode?: OptionalValue<string>;
  countryIsoCode2?: OptionalValue<string>;
};

export class UpdateContactCommand {
  private constructor(
    public readonly contactId: Id,
    public readonly firstName: Nullable<string>,
    public readonly lastName: Nullable<string>,
    public readonly birthdate: Nullable<string>,
    public readonly address: Nullable<Address>,
    public readonly phones: Nullable<Phone[]>,
    public readonly emails: Nullable<Email[]>,
  ) {}

  public static create(
    id: OptionalValue<string>,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    birthdate: OptionalValue<string>,
    address: OptionalValue<CreateAddressRequest>,
    phones: OptionalValue<CreatePhoneRequest[]>,
    emails: OptionalValue<string[]>,
  ): Result<UpdateContactCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.CONTACT_ID_EMPTY,
        () => DomainErrorCode.CONTACT_ID_INVALID,
      ) as Result<Id>,
      firstName !== undefined ? Contact.validateFirstName(firstName) : Result.ok(null),
      lastName !== undefined ? Contact.validateLastName(lastName) : Result.ok(null),
      birthdate !== undefined ? Contact.validateBirthdate(birthdate).map(() => birthdate) : Result.ok(null),
      address !== undefined
        ? Address.create(
            address?.addressLine1,
            address?.addressLine2,
            address?.state,
            address?.city,
            address?.zipCode,
            address?.countryIsoCode2,
          )
        : Result.ok(null),
      phones !== undefined
        ? Validator.of(phones)
            .required(() => DomainErrorCode.CONTACT_PHONES_EMPTY)
            .array(() => DomainErrorCode.CONTACT_PHONES_INVALID)
            .minLength(1, () => DomainErrorCode.CONTACT_PHONES_INVALID_SIZE)
            .flatMap((phones) =>
              Result.combine([
                ...phones.map((phone) => Phone.create(phone?.intlPrefix, phone?.regionCode, phone?.number)),
              ]),
            )
            .flatMap((phones) => Contact.validatePhonesLength(phones))
        : Result.ok(null),
      emails !== undefined
        ? Validator.of(emails)
            .required(() => DomainErrorCode.CONTACT_EMAILS_EMPTY)
            .array(() => DomainErrorCode.CONTACT_EMAILS_INVALID)
            .minLength(1, () => DomainErrorCode.CONTACT_EMAILS_INVALID_SIZE)
            .flatMap((emails) => Result.combine([...emails.map((email) => Email.createUnverified(email))]))
            .flatMap((emails) => Contact.validateEmailsLength(emails))
        : Result.ok(null),
    ]).map((params) => new UpdateContactCommand(...params));
  }
}
