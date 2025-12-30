import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class Distribution {
  constructor(
    public readonly userId: Id,
    public readonly amount: number,
  ) {}

  static create(userId: Id, amount: OptionalValue<number>): Result<Distribution> {
    return Result.combine({
      amount: Distribution.validateAmount(amount),
    }).map(({ amount }) => new Distribution(userId, amount));
  }

  static validateAmount(amount: OptionalValue<number>): Result<number> {
    return Validator.of(amount)
      .required(() => DomainErrorCode.COMMISSION_AMOUNT_EMPTY)
      .number(() => DomainErrorCode.COMMISSION_AMOUNT_INVALID)
      .min(0, () => DomainErrorCode.COMMISSION_AMOUNT_INVALID);
  }
}
