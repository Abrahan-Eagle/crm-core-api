import { Address, BadRequest, Nullable, OptionalValue, Result, Validator } from '@internal/common';
import { PaginationQuery } from '@internal/http';

import { DomainErrorCode, Industry } from '@/domain/common';
import { CONTACT_IDENTIFICATION_TYPE } from '@/domain/contact';

import { Bank, BANK_TERRITORY, BANK_TYPE, BankConstraints, BankConstraintsDeposits, BankTerritory } from '../entities';

export class SearchBanksQuery {
  private constructor(
    public readonly pagination: PaginationQuery,
    public readonly search: OptionalValue<string>,
    public readonly classifications: Nullable<string[]>,
    public readonly territories: Nullable<BANK_TERRITORY[]>,
    public readonly countries: Nullable<string[]>,
    public readonly status: Nullable<string>,
    public readonly bankType: Nullable<BANK_TYPE>,
    public readonly depositsMinimumTransactions: Nullable<number>,
    public readonly depositsMinimumAmount: Nullable<number>,
    public readonly maximumNegativeDays: Nullable<number>,
    public readonly minimumDailyBalance: Nullable<number>,
    public readonly loanLimit: Nullable<number>,
    public readonly minimumMonthsInBusiness: Nullable<number>,
    public readonly supportedIds: Nullable<string[]>,
    public readonly allowedIndustries: Nullable<Industry[]>,
    public readonly positions: Nullable<number[]>,
    public readonly identificationTypes: Nullable<CONTACT_IDENTIFICATION_TYPE[]>,
    public readonly blacklisted: Nullable<boolean>,
  ) {}

  static create(
    pagination: PaginationQuery,
    search: OptionalValue<string>,
    classifications: OptionalValue<string[]>,
    territories: OptionalValue<string[]>,
    countries: OptionalValue<string[]>,
    status: OptionalValue<string>,
    bankType: OptionalValue<string>,
    depositsMinimumTransactions: OptionalValue<number>,
    depositsMinimumAmount: OptionalValue<number>,
    maximumNegativeDays: OptionalValue<number>,
    minimumDailyBalance: OptionalValue<number>,
    loanLimit: OptionalValue<number>,
    minimumMonthsInBusiness: OptionalValue<number>,
    supportedIds: OptionalValue<string[]>,
    allowedIndustries: OptionalValue<string[]>,
    positions: OptionalValue<number[]>,
    identificationTypes?: OptionalValue<string[]>,
    blacklisted?: OptionalValue<boolean>,
  ): Result<SearchBanksQuery> {
    return Result.combine([
      classifications !== undefined ? BankConstraints.validateClassifications(classifications) : Result.ok(null),
      territories !== undefined
        ? Validator.of(territories)
            .array(() => DomainErrorCode.BANK_TERRITORY_INVALID)
            .flatMap((values) => Result.combine(values!.map((value) => BankTerritory.validateTerritory(value))))
        : Result.ok(null),
      countries !== undefined ? this.validateCountries(countries!) : Result.ok(null),
      status !== undefined ? Bank.validateStatus(status) : Result.ok(null),
      bankType !== undefined ? Bank.validateBankType(bankType) : Result.ok(null),
      depositsMinimumTransactions !== undefined
        ? BankConstraintsDeposits.validateMinimumAmountOfTransactions(depositsMinimumTransactions)
        : Result.ok(null),
      depositsMinimumAmount !== undefined
        ? BankConstraintsDeposits.validateMinimumAmountOfDeposits(depositsMinimumAmount)
        : Result.ok(null),
      maximumNegativeDays !== undefined
        ? BankConstraints.validateMaximumNegativeDays(maximumNegativeDays)
        : Result.ok(null),
      minimumDailyBalance !== undefined
        ? BankConstraints.validateMinimumDailyBalance(minimumDailyBalance)
        : Result.ok(null),
      loanLimit !== undefined ? BankConstraints.validateLoanLimit(loanLimit) : Result.ok(null),
      minimumMonthsInBusiness !== undefined
        ? BankConstraints.validateMinimumMonthsInBusiness(minimumMonthsInBusiness)
        : Result.ok(null),
      supportedIds !== undefined ? BankConstraints.validateSupportedIds(supportedIds) : Result.ok(null),
      allowedIndustries !== undefined
        ? Validator.of(allowedIndustries)
            .required(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_EMPTY)
            .array(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_INVALID)
            .flatMap((industries) => Result.combine(industries.map((industry) => Industry.create(industry))))
            .flatMap((industries) => BankConstraints.validateAllowedIndustries(industries))
        : Result.ok(null),
      positions !== undefined ? BankConstraints.validatePositions(positions) : Result.ok(null),
      identificationTypes !== undefined
        ? Validator.of(identificationTypes)
            .array(() => DomainErrorCode.IDENTIFICATION_TYPE_INVALID)
            .mapIfAbsent(() => [] as OptionalValue<string>[])
            .flatMap((ids) =>
              Result.combine(
                ids.map((id) =>
                  Validator.of(id)
                    .required(() => DomainErrorCode.IDENTIFICATION_TYPE_EMPTY)
                    .enum(CONTACT_IDENTIFICATION_TYPE, () => DomainErrorCode.IDENTIFICATION_TYPE_INVALID),
                ),
              ),
            )
        : Result.ok(null),
    ]).map((params) => new SearchBanksQuery(pagination, search, ...params, blacklisted !== undefined ? true : null));
  }

  private static validateCountries(countryIsoCodes2: string[]): Result<string[]> {
    return Validator.of(countryIsoCodes2)
      .array(() => DomainErrorCode.COUNTRY_ISO_CODE_INVALID)
      .flatMap((countryIsoCodes2) =>
        Result.combine(countryIsoCodes2.map((countryIsoCode2) => Address.validateCountryIsoCode2(countryIsoCode2))),
      )
      .validate(
        (territories) => new Set(territories).size === territories.length,
        () => new BadRequest(DomainErrorCode.COUNTRY_ISO_CODE_INVALID),
      );
  }
}
