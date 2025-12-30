import { Address, Email, OptionalValue, Phone, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { BufferFile, DomainErrorCode, Id } from '@/domain/common';
import { Industry } from '@/domain/common/types/industry';
import { normalizeFileName } from '@/domain/common/utils';

import { Bank, BankConstraints, BankConstraintsDeposits, BankContact, DepositConstraintByIndustry } from '../entities';
import { BankTerritory } from '../entities/bank-territory.entity';

type CreatePhoneRequest = {
  intlPrefix?: OptionalValue<string>;
  regionCode?: OptionalValue<string>;
  number?: OptionalValue<string>;
};

type CreateContactRequest = {
  firstName?: OptionalValue<string>;
  lastName?: OptionalValue<string>;
  phones?: OptionalValue<CreatePhoneRequest[]>;
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

type CreateConstraintsRequest = {
  classifications?: OptionalValue<string[]>;
  territories?: OptionalValue<{ territory?: OptionalValue<string>; excludedStates?: OptionalValue<string[]> }[]>;
  deposits?: OptionalValue<{
    minimumAmount: OptionalValue<number>;
    minimumTransactions: OptionalValue<number>;
    byIndustries: OptionalValue<
      {
        minimumAmount: OptionalValue<number>;
        minimumTransactions: OptionalValue<number>;
        industry: OptionalValue<string>;
      }[]
    >;
  }>;
  loanLimit?: OptionalValue<number>;
  hasLoanLimit?: OptionalValue<boolean>;
  minimumLoan?: OptionalValue<number>;
  minimumMonthsInBusiness?: OptionalValue<number>;
  minimumDailyBalance?: OptionalValue<number>;
  maximumNegativeDays?: OptionalValue<number>;
  allowedIndustries?: OptionalValue<string[]>;
  supportedIDs?: OptionalValue<string[]>;
  positions?: OptionalValue<number[]>;
  blockedProducts?: OptionalValue<string[]>;
};

export class CreateBankCommand {
  private constructor(
    public readonly bank: Bank,
    public readonly files: BufferFile[],
  ) {}

  static create(
    id: OptionalValue<string>,
    bankName: OptionalValue<string>,
    manager: OptionalValue<string>,
    bankType: OptionalValue<string>,
    address: OptionalValue<CreateAddressRequest>,
    contacts: OptionalValue<CreateContactRequest[]>,
    constraints: OptionalValue<CreateConstraintsRequest>,
    files: OptionalValue<Express.Multer.File[]>,
  ): Result<CreateBankCommand> {
    return Result.combine([
      Id.create(
        id,
        () => DomainErrorCode.BANK_ID_EMPTY,
        () => DomainErrorCode.BANK_ID_INVALID,
      ),
      Bank.validateBankType(bankType),
      Address.create(
        address?.addressLine1,
        address?.addressLine2,
        address?.state,
        address?.city,
        address?.zipCode,
        address?.countryIsoCode2,
      ),
      // Contacts
      Validator.of(contacts)
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
        ),
      // Constraints
      Validator.of(constraints?.deposits)
        .mapIfPresent((deposits) =>
          BankConstraintsDeposits.create(
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
          ).getOrThrow(),
        )
        .mapIfAbsent(() => null)
        .flatMap((depositConstraints) =>
          Validator.of(constraints?.allowedIndustries)
            .required(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_EMPTY)
            .array(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_INVALID)
            .flatMap((industries) => Result.combine(industries.map((industry) => Industry.create(industry))))
            .flatMap((industries) =>
              Result.combine([
                Result.ok(industries),
                Validator.of(constraints?.territories)
                  .required(() => DomainErrorCode.BANK_TERRITORY_EMPTY)
                  .array(() => DomainErrorCode.BANK_TERRITORY_INVALID)
                  .flatMap((territories) =>
                    Result.combine(
                      territories.map((item) => BankTerritory.create(item?.territory, item?.excludedStates)),
                    ),
                  ),
              ]),
            )
            .flatMap(([industries, territories]) =>
              BankConstraints.create(
                constraints?.classifications,
                territories,
                depositConstraints,
                constraints?.loanLimit,
                constraints?.hasLoanLimit,
                constraints?.minimumLoan,
                constraints?.minimumMonthsInBusiness,
                constraints?.minimumDailyBalance,
                constraints?.maximumNegativeDays,
                industries,
                constraints?.supportedIDs,
                constraints?.positions,
                constraints?.blockedProducts,
              ),
            ),
        ),
    ])
      .flatMap(([id, bankType, address, contacts, constraints]) =>
        Bank.create(id, bankName, manager, address, contacts, bankType, constraints),
      )
      .flatMap((bank) =>
        Result.combine([
          Result.ok(bank),
          Validator.of(files)
            .array(() => DomainErrorCode.BANK_DOCUMENTS_INVALID)
            .mapIfAbsent(() => [])
            .flatMap((files) =>
              Result.combine(
                files.map((file) =>
                  Validator.of(file)
                    .required(() => DomainErrorCode.FILE_PATH_EMPTY)
                    .map(
                      (file) =>
                        new BufferFile(
                          `${bank.id.toString()}/${normalizeFileName(
                            Buffer.from(file.originalname, 'latin1').toString('utf8'),
                          )}`,
                          file.buffer,
                          extname(file.originalname),
                          file.mimetype,
                        ),
                    ),
                ),
              ),
            ) as Result<BufferFile[]>,
        ]),
      )
      .map(([bank, documents]) => new CreateBankCommand(bank, documents));
  }
}
