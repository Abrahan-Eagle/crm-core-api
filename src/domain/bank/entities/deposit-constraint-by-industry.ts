import { OptionalValue, Result } from '@internal/common';

import { Industry } from '@/domain/common';

import { BankConstraintsDeposits } from './bank-constraints-deposits';

export class DepositConstraintByIndustry {
  constructor(
    public readonly minimumAmount: number,
    public readonly minimumTransactions: number,
    public readonly industry: Industry,
  ) {}

  static create(
    minimumAmount: OptionalValue<number>,
    minimumTransactions: OptionalValue<number>,
    industry: Industry,
  ): Result<DepositConstraintByIndustry> {
    return Result.combine({
      minimumAmount: BankConstraintsDeposits.validateMinimumAmountOfDeposits(minimumAmount),
      minimumTransactions: BankConstraintsDeposits.validateMinimumAmountOfTransactions(minimumTransactions),
    }).map(
      ({ minimumAmount, minimumTransactions }) =>
        new DepositConstraintByIndustry(minimumAmount, minimumTransactions, industry),
    );
  }
}
