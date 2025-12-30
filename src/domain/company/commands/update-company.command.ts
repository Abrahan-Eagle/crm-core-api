import { Address, Email, Nullable, OptionalValue, Phone, Result, Validator } from '@internal/common';

import { DomainErrorCode, ENTITY_TYPE, Id, Industry } from '@/domain/common';

import { Company, CompanyMember } from '../entities';

type UpdateCompanyAddressRequest = {
  addressLine1: OptionalValue<string>;
  addressLine2: OptionalValue<string>;
  city: OptionalValue<string>;
  state: OptionalValue<string>;
  zipCode: OptionalValue<string>;
  countryIsoCode2: OptionalValue<string>;
};

type UpdateCompanyPhoneNumberRequest = {
  intlPrefix: OptionalValue<string>;
  regionCode: OptionalValue<string>;
  number: OptionalValue<string>;
};

type UpdateCompanyMemberRequest = {
  contactId: OptionalValue<string>;
  title: OptionalValue<string>;
  percentage: OptionalValue<number>;
  memberSince: OptionalValue<string>;
};

export class UpdateCompanyCommand {
  private constructor(
    public readonly companyId: Id,
    public readonly companyName: Nullable<string>,
    public readonly dba: Nullable<string>,
    public readonly industry: Nullable<Industry>,
    public readonly service: Nullable<string>,
    public readonly creationDate: Nullable<string>,
    public readonly entityType: Nullable<ENTITY_TYPE>,
    public readonly phoneNumbers: Nullable<Phone[]>,
    public readonly emails: Nullable<Email[]>,
    public readonly address: Nullable<Address>,
    public readonly members: Nullable<CompanyMember[]>,
  ) {}

  static create(
    id: OptionalValue<string>,
    companyName: OptionalValue<string>,
    dba: OptionalValue<string>,
    industry: OptionalValue<string>,
    service: OptionalValue<string>,
    creationDate: OptionalValue<string>,
    entityType: OptionalValue<string>,
    phoneNumbers: OptionalValue<UpdateCompanyPhoneNumberRequest[]>,
    emails: OptionalValue<string[]>,
    address: OptionalValue<UpdateCompanyAddressRequest>,
    members: OptionalValue<UpdateCompanyMemberRequest[]>,
  ): Result<UpdateCompanyCommand> {
    return Result.combine([
      // id
      Id.create(
        id,
        () => DomainErrorCode.COMPANY_ID_EMPTY,
        () => DomainErrorCode.COMPANY_ID_INVALID,
      ),
      // companyName
      companyName !== undefined ? Company.validateCompanyName(companyName) : Result.ok(null),
      // dba
      dba !== undefined ? Company.validateDba(dba) : Result.ok(null),
      // industry
      industry !== undefined ? Industry.create(industry) : Result.ok(null),
      service !== undefined ? Company.validateService(service) : Result.ok(null),
      // creationDate
      // TODO Refactor
      creationDate !== undefined ? Company.validateCreationDate(creationDate).map(() => creationDate) : Result.ok(null),
      // entityType
      entityType !== undefined ? Company.validateEntityType(entityType) : Result.ok(null),

      // Phones
      phoneNumbers !== undefined
        ? Company.validatePhoneNumbers(phoneNumbers).flatMap((phoneNumbers) =>
            Result.combine(
              phoneNumbers.flatMap((phone) => Phone.create(phone?.intlPrefix, phone?.regionCode, phone?.number)),
            ),
          )
        : Result.ok(null),
      // Emails
      emails !== undefined
        ? Company.validateEmails(emails).flatMap((emails) =>
            Result.combine(emails.flatMap((email) => Email.createUnverified(email))),
          )
        : Result.ok(null),

      // address
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

      // members
      members !== undefined
        ? Validator.of(members)
            .required(() => DomainErrorCode.COMPANY_MEMBERS_EMPTY)
            .array(() => DomainErrorCode.COMPANY_MEMBERS_INVALID)
            .notEmpty(() => DomainErrorCode.COMPANY_MEMBERS_EMPTY)
            .flatMap((members) =>
              Result.combine(
                members?.map((member) =>
                  Result.combine([
                    Id.create(
                      member.contactId,
                      () => DomainErrorCode.COMPANY_MEMBER_ID_EMPTY,
                      () => DomainErrorCode.COMPANY_MEMBER_ID_INVALID,
                    ),
                  ]).flatMap(([contactId]) =>
                    CompanyMember.create(contactId, member?.title, member?.percentage, member?.memberSince),
                  ),
                ),
              ),
            )
            .flatMap((members) => Company.validateMembersAndCheckRules(members))
        : Result.ok(null),
    ]).map((params) => new UpdateCompanyCommand(...params));
  }
}
