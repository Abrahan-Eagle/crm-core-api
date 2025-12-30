import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Industry } from '@/domain/common';

type DepositConstraintByIndustry = {
  minimumAmount: number;
  minimumTransactions: number;
  industry: Industry;
};
export class BankConstraintsDeposits {
  constructor(
    public readonly minimumAmount: number,
    public readonly minimumTransactions: number,
    public readonly byIndustries: DepositConstraintByIndustry[],
  ) {}

  static create(
    minimumAmount: OptionalValue<number>,
    minimumTransactions: OptionalValue<number>,
    restrictionsByIndustries: DepositConstraintByIndustry[],
  ): Result<BankConstraintsDeposits> {
    return Result.combine({
      minimumAmount: this.validateMinimumAmountOfDeposits(minimumAmount),
      minimumTransactions: this.validateMinimumAmountOfTransactions(minimumTransactions),
      restrictionsByIndustries: this.validateRestrictionsByIndustries(restrictionsByIndustries),
    }).map(
      ({ minimumAmount, minimumTransactions, restrictionsByIndustries }) =>
        new BankConstraintsDeposits(minimumAmount, minimumTransactions, restrictionsByIndustries),
    );
  }

  static validateMinimumAmountOfDeposits(minimumAmount: OptionalValue<number>): Result<number> {
    return Validator.of(minimumAmount)
      .required(() => DomainErrorCode.BANK_MINIMUM_AMOUNT_OF_DEPOSITS_EMPTY)
      .number(() => DomainErrorCode.BANK_MINIMUM_AMOUNT_OF_DEPOSITS_INVALID)
      .min(0, () => DomainErrorCode.BANK_MINIMUM_AMOUNT_OF_DEPOSITS_INVALID);
  }

  static validateMinimumAmountOfTransactions(minimumTransactions: OptionalValue<number>): Result<number> {
    return Validator.of(minimumTransactions)
      .required(() => DomainErrorCode.BANK_MINIMUM_AMOUNT_OF_TRANSACTIONS_EMPTY)
      .number(() => DomainErrorCode.BANK_MINIMUM_AMOUNT_OF_TRANSACTIONS_INVALID)
      .min(0, () => DomainErrorCode.BANK_MINIMUM_AMOUNT_OF_TRANSACTIONS_INVALID);
  }

  static validateRestrictionsByIndustries(
    constraints: {
      minimumAmount: OptionalValue<number>;
      minimumTransactions: OptionalValue<number>;
      industry: Industry;
    }[],
  ): Result<DepositConstraintByIndustry[]> {
    return Validator.of(constraints)
      .array(() => DomainErrorCode.BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_INVALID)
      .unique(
        (constraint) => constraint.industry.id,
        () => DomainErrorCode.BANK_DEPOSITS_CONSTRAINTS_BY_INDUSTRIES_DUPLICATED,
      );
  }
}
