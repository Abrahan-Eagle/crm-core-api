import { BadRequest, Nullable, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, PRODUCT_TYPE } from '@/domain/common';
import { Industry } from '@/domain/common/types/industry';

import { BankConstraintsDeposits } from './bank-constraints-deposits';
import { BankTerritory } from './bank-territory.entity';

export enum BANK_CLASSIFICATION {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum BANK_SUPPORTED_ID {
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  PASSPORT = 'PASSPORT',
  GREEN_CARD_10_YEARS = 'GREEN_CARD_10_YEARS',
  GREEN_CARD_2_YEARS = 'GREEN_CARD_2_YEARS',
  RESTRICTED_DRIVER_LICENSE = 'RESTRICTED_DRIVER_LICENSE',
  WORK_LICENSE = 'WORK_LICENSE',
  ITIN = 'ITIN',
  CHECK = 'CHECK',
  EIN_AND_IRS = 'EIN_AND_IRS',
  W9 = 'W9',
  OTHER = 'OTHER',
  EIN = 'EIN',
  SSN = 'SSN',
  VOIDED_CHECK = 'VOIDED_CHECK',
  OPEN_COMPANY_LETTER = 'OPEN_COMPANY_LETTER',
  TAXES = 'TAXES',
}

export const MIN_LOAN_AMOUNT = 1000;

export interface BankConstraintsParams {
  classifications?: Nullable<BANK_CLASSIFICATION[]>;
  territories?: Nullable<BankTerritory[]>;
  deposits?: Nullable<BankConstraintsDeposits>;
  loanLimit?: Nullable<number>;
  hasLoanLimit?: Nullable<boolean>;
  minimumLoan?: Nullable<number>;
  minimumMonthsInBusiness?: Nullable<number>;
  minimumDailyBalance?: Nullable<number>;
  maximumNegativeDays?: Nullable<number>;
  allowedIndustries?: Nullable<Industry[]>;
  supportedIDs?: Nullable<BANK_SUPPORTED_ID[]>;
  positions: Nullable<number[]>;
  blockedProducts: Nullable<PRODUCT_TYPE[]>;
}

export class BankConstraints {
  constructor(
    private _classifications: BANK_CLASSIFICATION[],
    private _territories: BankTerritory[],
    private _deposits: Nullable<BankConstraintsDeposits>,
    private _loanLimit: Nullable<number>,
    private _hasLoanLimit: boolean,
    private _minimumLoan: number,
    private _minimumMonthsInBusiness: number,
    private _minimumDailyBalance: number,
    private _maximumNegativeDays: number,
    private _allowedIndustries: Industry[],
    private _supportedIDs: BANK_SUPPORTED_ID[],
    private _positions: number[],
    private _blockedProducts: PRODUCT_TYPE[],
  ) {}

  get classifications() {
    return this._classifications;
  }

  get territories() {
    return this._territories;
  }

  get deposits() {
    return this._deposits;
  }

  get loanLimit() {
    return this.hasLoanLimit ? this._loanLimit : null;
  }

  get hasLoanLimit() {
    return this._hasLoanLimit;
  }

  get minimumLoan() {
    return this._minimumLoan;
  }

  get minimumMonthsInBusiness() {
    return this._minimumMonthsInBusiness;
  }

  get minimumDailyBalance() {
    return this._minimumDailyBalance;
  }

  get maximumNegativeDays() {
    return this._maximumNegativeDays;
  }

  get allowedIndustries() {
    return this._allowedIndustries;
  }

  get supportedIDs() {
    return this._supportedIDs;
  }

  get positions() {
    return this._positions.sort();
  }

  get blockedProducts() {
    return this._blockedProducts;
  }

  static create(
    classifications: OptionalValue<string[]>,
    territories: OptionalValue<BankTerritory[]>,
    deposits: Nullable<BankConstraintsDeposits>,
    loanLimit: OptionalValue<number>,
    hasLoanLimit: OptionalValue<boolean>,
    minimumLoan: OptionalValue<number>,
    minimumMonthsInBusiness: OptionalValue<number>,
    minimumDailyBalance: OptionalValue<number>,
    maximumNegativeDays: OptionalValue<number>,
    allowedIndustries: OptionalValue<Industry[]>,
    supportedIDs: OptionalValue<string[]>,
    positions: OptionalValue<number[]>,
    blockedProducts: OptionalValue<string[]>,
  ): Result<BankConstraints> {
    return Result.combine([
      BankConstraints.validateClassifications(classifications),
      BankConstraints.validateTerritories(territories),
      Result.ok(deposits),
      loanLimit ? BankConstraints.validateLoanLimit(loanLimit) : Result.ok(null),
      BankConstraints.validateHasLoanLimit(hasLoanLimit),
      BankConstraints.validateMinimumLoan(minimumLoan),
      BankConstraints.validateMinimumMonthsInBusiness(minimumMonthsInBusiness),
      BankConstraints.validateMinimumDailyBalance(minimumDailyBalance),
      BankConstraints.validateMaximumNegativeDays(maximumNegativeDays),
      BankConstraints.validateAllowedIndustries(allowedIndustries),
      BankConstraints.validateSupportedIds(supportedIDs),
      BankConstraints.validatePositions(positions),
      BankConstraints.validateBlockedProducts(blockedProducts),
    ]).map((params) => new BankConstraints(...params));
  }

  static validateClassifications(classifications: OptionalValue<string[]>): Result<BANK_CLASSIFICATION[]> {
    return Validator.of(classifications)
      .required(() => DomainErrorCode.BANK_CLASSIFICATION_EMPTY)
      .array(() => DomainErrorCode.BANK_CLASSIFICATION_INVALID)
      .minLength(1, () => DomainErrorCode.BANK_SUPPORTED_ID_EMPTY)
      .flatMap(
        (classifications) =>
          Result.combine(
            classifications.map((classification) =>
              Validator.of(classification)
                .required(() => DomainErrorCode.BANK_CLASSIFICATION_EMPTY)
                .string(() => DomainErrorCode.BANK_CLASSIFICATION_INVALID)
                .map((classification) => classification.trim())
                .enum(BANK_CLASSIFICATION, () => DomainErrorCode.BANK_CLASSIFICATION_INVALID),
            ),
          ) as Result<BANK_CLASSIFICATION[]>,
      )
      .validate(
        (classifications) => new Set(classifications).size === classifications.length,
        () => new BadRequest(DomainErrorCode.BANK_SUPPORTED_ID_DUPLICATED),
      );
  }

  static validateSupportedIds(supportedIds: OptionalValue<string[]>): Result<BANK_SUPPORTED_ID[]> {
    return Validator.of(supportedIds)
      .required(() => DomainErrorCode.BANK_SUPPORTED_ID_EMPTY)
      .array(() => DomainErrorCode.BANK_SUPPORTED_ID_INVALID)
      .minLength(1, () => DomainErrorCode.BANK_SUPPORTED_ID_EMPTY)
      .flatMap(
        (ids) =>
          Result.combine(
            ids.map((id) =>
              Validator.of(id)
                .required(() => DomainErrorCode.BANK_SUPPORTED_ID_EMPTY)
                .string(() => DomainErrorCode.BANK_SUPPORTED_ID_INVALID)
                .map((id) => id.trim())
                .enum(BANK_SUPPORTED_ID, () => DomainErrorCode.BANK_SUPPORTED_ID_INVALID),
            ),
          ) as Result<BANK_SUPPORTED_ID[]>,
      )
      .validate(
        (ids) => new Set(ids).size === ids.length,
        () => new BadRequest(DomainErrorCode.BANK_SUPPORTED_ID_DUPLICATED),
      );
  }

  static validatePositions(positions: OptionalValue<number[]>): Result<number[]> {
    return Validator.of(positions)
      .required(() => DomainErrorCode.BANK_POSITIONS_EMPTY)
      .array(() => DomainErrorCode.BANK_POSITIONS_INVALID)
      .minLength(1, () => DomainErrorCode.BANK_POSITIONS_EMPTY)
      .flatMap(
        (positions) =>
          Result.combine(
            positions.map((position) =>
              Validator.of(position)
                .required(() => DomainErrorCode.BANK_POSITION_EMPTY)
                .number(() => DomainErrorCode.BANK_POSITION_INVALID)
                .min(1, () => DomainErrorCode.POSITION_TOO_LOW)
                .max(5, () => DomainErrorCode.POSITION_TOO_HIGH),
            ),
          ) as Result<number[]>,
      )
      .validate(
        (ids) => new Set(ids).size === ids.length,
        () => new BadRequest(DomainErrorCode.BANK_POSITION_DUPLICATED),
      );
  }

  static validateBlockedProducts(products: OptionalValue<string[]>): Result<PRODUCT_TYPE[]> {
    return Validator.of(products)
      .required(() => DomainErrorCode.BANK_BLOCKED_PRODUCT_ID_EMPTY)
      .array(() => DomainErrorCode.BANK_BLOCKED_PRODUCT_ID_INVALID)
      .flatMap(
        (ids) =>
          Result.combine(
            ids.map((id) =>
              Validator.of(id)
                .required(() => DomainErrorCode.BANK_BLOCKED_PRODUCT_ID_EMPTY)
                .string(() => DomainErrorCode.BANK_BLOCKED_PRODUCT_ID_INVALID)
                .map((id) => id.trim())
                .enum(PRODUCT_TYPE, () => DomainErrorCode.BANK_BLOCKED_PRODUCT_ID_INVALID),
            ),
          ) as Result<PRODUCT_TYPE[]>,
      )
      .validate(
        (ids) => new Set(ids).size === ids.length,
        () => new BadRequest(DomainErrorCode.BANK_BLOCKED_PRODUCT_ID_DUPLICATED),
      );
  }

  static validateTerritories(territories: OptionalValue<BankTerritory[]>): Result<BankTerritory[]> {
    return Validator.of(territories)
      .required(() => DomainErrorCode.BANK_TERRITORY_EMPTY)
      .array(() => DomainErrorCode.BANK_TERRITORY_INVALID)
      .minLength(1, () => DomainErrorCode.BANK_TERRITORY_EMPTY)
      .unique(
        (constraint) => constraint.territory.toString(),
        () => new BadRequest(DomainErrorCode.BANK_TERRITORY_DUPLICATED),
      );
  }

  static validateLoanLimit(loanLimit: OptionalValue<number>): Result<Nullable<number>> {
    return Validator.of(loanLimit)
      .number(() => DomainErrorCode.BANK_LOAN_LIMIT_INVALID)
      .min(0, () => DomainErrorCode.BANK_LOAN_LIMIT_INVALID)
      .mapIfAbsent(() => null);
  }

  static validateHasLoanLimit(hasLoanLimit: OptionalValue<boolean>): Result<boolean> {
    return Validator.of(hasLoanLimit)
      .required(() => DomainErrorCode.BANK_HAS_LOAN_LIMIT_EMPTY)
      .boolean(() => DomainErrorCode.BANK_LOAN_LIMIT_INVALID);
  }

  static validateMinimumLoan(minimumLoan: OptionalValue<number>): Result<number> {
    return Validator.of(minimumLoan)
      .required(() => DomainErrorCode.BANK_MINIMUM_LOAN_EMPTY)
      .number(() => DomainErrorCode.BANK_MINIMUM_LOAN_INVALID)
      .min(MIN_LOAN_AMOUNT, () => DomainErrorCode.BANK_MINIMUM_LOAN_INVALID);
  }

  static validateMinimumMonthsInBusiness(minimumMonthsInBusiness: OptionalValue<number>): Result<number> {
    return Validator.of(minimumMonthsInBusiness)
      .required(() => DomainErrorCode.BANK_MINIMUM_MONTHS_IN_BUSINESS_EMPTY)
      .number(() => DomainErrorCode.BANK_MINIMUM_MONTHS_IN_BUSINESS_INVALID)
      .min(0, () => DomainErrorCode.BANK_MINIMUM_MONTHS_IN_BUSINESS_INVALID);
  }

  static validateMinimumDailyBalance(minimumDailyBalance: OptionalValue<number>): Result<number> {
    return Validator.of(minimumDailyBalance)
      .required(() => DomainErrorCode.BANK_MINIMUM_DAILY_BALANCE_EMPTY)
      .number(() => DomainErrorCode.BANK_MINIMUM_DAILY_BALANCE_INVALID)
      .min(0, () => DomainErrorCode.BANK_MINIMUM_DAILY_BALANCE_INVALID);
  }

  static validateMaximumNegativeDays(maximumNegativeDays: OptionalValue<number>): Result<number> {
    return Validator.of(maximumNegativeDays)
      .required(() => DomainErrorCode.BANK_MAXIMUM_NEGATIVE_DAYS_EMPTY)
      .number(() => DomainErrorCode.BANK_MAXIMUM_NEGATIVE_DAYS_INVALID)
      .min(0, () => DomainErrorCode.BANK_MAXIMUM_NEGATIVE_DAYS_INVALID);
  }

  static validateAllowedIndustries(allowedIndustries: OptionalValue<Industry[]>): Result<Industry[]> {
    return Validator.of(allowedIndustries)
      .required(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_EMPTY)
      .array(() => DomainErrorCode.BANK_ALLOWED_INDUSTRIES_INVALID)
      .validate(
        (industries) => new Set(industries.map((industry) => industry.id)).size === industries.length,
        () => DomainErrorCode.BANK_INDUSTRY_DUPLICATED,
      );
  }

  copyWith(params: BankConstraintsParams): Result<BankConstraints> {
    return Result.combine([
      params.classifications
        ? BankConstraints.validateClassifications(params.classifications)
        : Result.ok(this.classifications),
      params.territories ? BankConstraints.validateTerritories(params.territories) : Result.ok(this.territories),
      params.deposits ? Result.ok(params.deposits) : Result.ok(this.deposits),
      params.loanLimit ? BankConstraints.validateLoanLimit(params.loanLimit) : Result.ok(this.loanLimit),
      params.hasLoanLimit !== undefined && params.hasLoanLimit !== null
        ? BankConstraints.validateHasLoanLimit(params.hasLoanLimit)
        : Result.ok(this.hasLoanLimit),
      params.minimumLoan ? BankConstraints.validateMinimumLoan(params.minimumLoan) : Result.ok(this.minimumLoan),
      params.minimumMonthsInBusiness
        ? BankConstraints.validateMinimumMonthsInBusiness(params.minimumMonthsInBusiness)
        : Result.ok(this.minimumMonthsInBusiness),
      params.minimumDailyBalance
        ? BankConstraints.validateMinimumDailyBalance(params.minimumDailyBalance)
        : Result.ok(this.minimumDailyBalance),
      params.maximumNegativeDays
        ? BankConstraints.validateMaximumNegativeDays(params.maximumNegativeDays)
        : Result.ok(this.maximumNegativeDays),
      params.allowedIndustries
        ? BankConstraints.validateAllowedIndustries(params.allowedIndustries)
        : Result.ok(this.allowedIndustries),
      params.supportedIDs ? BankConstraints.validateSupportedIds(params.supportedIDs) : Result.ok(this.supportedIDs),
      params.positions ? BankConstraints.validatePositions(params.positions) : Result.ok(this.positions),
      params.blockedProducts
        ? BankConstraints.validateBlockedProducts(params.blockedProducts)
        : Result.ok(this.blockedProducts),
    ]).map((params) => new BankConstraints(...params));
  }
}
