import { Address, Email, Nullable, OptionalValue, Phone, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id, Industry, PRODUCT_TYPE } from '@/domain/common';

import {
  Bank,
  BANK_CLASSIFICATION,
  BANK_SUPPORTED_ID,
  BANK_TYPE,
  BankConstraints,
  BankConstraintsDeposits,
  BankContact,
  DepositConstraintByIndustry,
} from '../entities';
import { BankTerritory } from '../entities/bank-territory.entity';

type UpdatePhoneRequest = {
  intlPrefix?: OptionalValue<string>;
  regionCode?: OptionalValue<string>;
  number?: OptionalValue<string>;
};

type CreateContactRequest = {
  firstName?: OptionalValue<string>;
  lastName?: OptionalValue<string>;
  phones?: OptionalValue<UpdatePhoneRequest[]>;
  emails?: string[];
};

type CreateAddressRequest = {
  addressLine1?: OptionalValue<string>;
  addressLine2?: OptionalValue<string>;
  state?: OptionalValue<string>;
  city?: OptionalValue<string>;
  zipCode?: OptionalValue<string>;
  countryIsoCode2?: OptionalValue<string>;
};

export class UpdateBankCommand {
  private constructor(
    public readonly bankId: Id,
    public readonly bankName: Nullable<string>,
    public readonly bankType: Nullable<BANK_TYPE>,
    public readonly manager: Nullable<string>,
    public readonly address: Nullable<Address>,
    public readonly contacts: Nullable<BankContact[]>,
    public readonly classifications: Nullable<BANK_CLASSIFICATION[]>,
    public readonly territories: Nullable<BankTerritory[]>,
    public readonly deposits: Nullable<BankConstraintsDeposits>,
    public readonly loanLimit: Nullable<number>,
    public readonly hasLoanLimit: Nullable<boolean>,
    public readonly minimumLoan: Nullable<number>,
    public readonly minimumMonthsInBusiness: Nullable<number>,
    public readonly minimumDailyBalance: Nullable<number>,
    public readonly maximumNegativeDays: Nullable<number>,
    public readonly allowedIndustries: Nullable<Industry[]>,
    public readonly supportedIDs: Nullable<BANK_SUPPORTED_ID[]>,
    public readonly positions: Nullable<number[]>,
    public readonly blockedProducts: Nullable<PRODUCT_TYPE[]>,
  ) {}

  static create(
    id: OptionalValue<string>,
    bankName: OptionalValue<string>,
    bankType: OptionalValue<string>,
    manager: OptionalValue<string>,
    address: OptionalValue<CreateAddressRequest>,
    contacts: OptionalValue<CreateContactRequest[]>,
    classifications: OptionalValue<string[]>,
    territories: OptionalValue<{ territory?: OptionalValue<string>; excludedStates?: OptionalValue<string[]> }[]>,
    deposits: OptionalValue<{
      minimumAmount: OptionalValue<number>;
      minimumTransactions: OptionalValue<number>;
      byIndustries: OptionalValue<
        {
          minimumAmount: OptionalValue<number>;
          minimumTransactions: OptionalValue<number>;
          industry: OptionalValue<string>;
        }[]
      >;
    }>,
    loanLimit: OptionalValue<number>,
    hasLoanLimit: OptionalValue<boolean>,
    minimumLoan: OptionalValue<number>,
    minimumMonthsInBusiness: OptionalValue<number>,
    minimumDailyBalance: OptionalValue<number>,
    maximumNegativeDays: OptionalValue<number>,
    allowedIndustries: OptionalValue<string[]>,
    supportedIDs: OptionalValue<string[]>,
    positions: OptionalValue<number[]>,
    blockedProducts: OptionalValue<string[]>,
  ): Result<UpdateBankCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.BANK_ID_EMPTY,
        () => DomainErrorCode.BANK_ID_INVALID,
      ) as Result<Id>,
      bankName !== undefined ? Bank.validateBankName(bankName) : Result.ok(null),
      bankType !== undefined ? Bank.validateBankType(bankType) : Result.ok(null),
      manager !== undefined ? Bank.validateManager(manager) : Result.ok(null),
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
      contacts !== undefined
        ? Validator.of(contacts)
            .required(() => DomainErrorCode.BANK_CONTACTS_EMPTY)
            .array(() => DomainErrorCode.BANK_CONTACTS_INVALID)
            .minLength(1, () => DomainErrorCode.BANK_CONTACTS_INVALID_SIZE)
            .flatMap((contacts) =>
              Result.combine(
                contacts.map((contact) => {
                  const phones = Validator.of(contact.phones)
                    .required(() => DomainErrorCode.BANK_CONTACTS_PHONES_EMPTY)
                    .array(() => DomainErrorCode.BANK_CONTACTS_PHONES_INVALID)
                    .minLength(1, () => DomainErrorCode.BANK_CONTACTS_PHONES_EMPTY)
                    .flatMap((phones) =>
                      Result.combine(
                        phones.map((phone) => Phone.create(phone?.intlPrefix, phone?.regionCode, phone?.number)),
                      ),
                    )
                    .getOrThrow();

                  const emails = Validator.of(contact.emails)
                    .required(() => DomainErrorCode.BANK_CONTACTS_EMAILS_EMPTY)
                    .array(() => DomainErrorCode.BANK_CONTACTS_EMAILS_INVALID)
                    .minLength(1, () => DomainErrorCode.BANK_CONTACTS_EMAILS_EMPTY)
                    .flatMap((emails) => Result.combine(emails.map((email) => Email.createUnverified(email))))
                    .getOrThrow();
                  return BankContact.create(contact?.firstName, contact?.lastName, phones, emails);
                }),
              ),
            )
            .flatMap((contacts) => Bank.validateContacts(contacts))
        : Result.ok(null),
      classifications !== undefined ? BankConstraints.validateClassifications(classifications) : Result.ok(null),
      territories !== undefined
        ? Validator.of(territories)
            .required(() => DomainErrorCode.BANK_TERRITORY_EMPTY)
            .array(() => DomainErrorCode.BANK_TERRITORY_INVALID)
            .flatMap((territories) =>
              Result.combine(territories.map((item) => BankTerritory.create(item?.territory, item?.excludedStates))),
            )
        : Result.ok(null),
      deposits !== undefined
        ? BankConstraintsDeposits.create(
            deposits?.minimumAmount,
            deposits?.minimumTransactions,
            Validator.of(deposits?.byIndustries)
              .array(() => DomainErrorCode.BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_INVALID)
              .required(() => DomainErrorCode.BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_INVALID)
              .flatMap((constraints) =>
                Result.combine(
                  constraints.map((constraint) =>
                    DepositConstraintByIndustry.create(
                      constraint?.minimumAmount,
                      constraint?.minimumTransactions,
                      Industry.create(constraint?.industry).getOrThrow(),
                    ),
                  ),
                ),
              )
              .getOrThrow(),
          )
        : Result.ok(null),
      loanLimit !== undefined ? BankConstraints.validateLoanLimit(loanLimit) : Result.ok(null),
      hasLoanLimit !== undefined && hasLoanLimit !== null
        ? BankConstraints.validateHasLoanLimit(hasLoanLimit)
        : Result.ok(null),
      minimumLoan !== undefined ? BankConstraints.validateMinimumLoan(minimumLoan) : Result.ok(null),
      minimumMonthsInBusiness !== undefined
        ? BankConstraints.validateMinimumMonthsInBusiness(minimumMonthsInBusiness)
        : Result.ok(null),
      minimumDailyBalance !== undefined
        ? BankConstraints.validateMinimumDailyBalance(minimumDailyBalance)
        : Result.ok(null),
      maximumNegativeDays !== undefined
        ? BankConstraints.validateMaximumNegativeDays(maximumNegativeDays)
        : Result.ok(null),
      allowedIndustries !== undefined
        ? Validator.of(allowedIndustries)
            .required(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_EMPTY)
            .array(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_INVALID)
            .flatMap((industries) => Result.combine(industries.map((industry) => Industry.create(industry))))
            .flatMap((industries) => BankConstraints.validateAllowedIndustries(industries))
        : Result.ok(null),
      supportedIDs !== undefined ? BankConstraints.validateSupportedIds(supportedIDs) : Result.ok(null),
      positions !== undefined ? BankConstraints.validatePositions(positions) : Result.ok(null),
      blockedProducts !== undefined ? BankConstraints.validateBlockedProducts(blockedProducts) : Result.ok(null),
    ]).map((params) => new UpdateBankCommand(...params));
  }
}
