import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '@/domain/common';

import { Distribution } from './distribution.entity';

const MAX_COMISSION_TOTAL = 999999999;

export class CommissionDetail {
  constructor(
    private _total: number,
    private _distribution: Distribution[],
    public readonly blocked: boolean,
  ) {}

  get total(): number {
    return this._total;
  }

  get distribution(): Distribution[] {
    return this._distribution;
  }

  get earnings(): number {
    return this.total - this.distribution.reduce((acc, current) => acc + current.amount, 0);
  }

  static create(total: OptionalValue<number>, blocked: boolean): Result<CommissionDetail> {
    return CommissionDetail.validateTotal(total).map((total) => new CommissionDetail(total, [], blocked));
  }

  static validateTotal(total: OptionalValue<number>): Result<number> {
    return Validator.of(total)
      .required(() => DomainErrorCode.COMMISSION_TOTAL_EMPTY)
      .number(() => DomainErrorCode.COMMISSION_TOTAL_INVALID)
      .min(0, () => DomainErrorCode.COMMISSION_TOTAL_INVALID)
      .max(MAX_COMISSION_TOTAL, () => DomainErrorCode.COMMISSION_TOTAL_INVALID);
  }

  public update(total: number, distribution: Distribution[]): Result<void> {
    return Validator.of(distribution.reduce((prev, curr) => prev + curr.amount, 0))
      .max(total, () => DomainErrorCode.OVERDISTRIBUTION)
      .onSuccess(() => {
        this._distribution = distribution;
        this._total = total;
      })
      .flatMap(() => Result.ok());
  }
}
