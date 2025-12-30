import { Expose, Type } from 'class-transformer';

import { IndustryResponse } from '@/app/common';

import { BankTerritoryResponse } from './bank-territory.response';
import { DepositConstraintResponse } from './deposit-constraint.response';

export class ConstraintsResponse {
  @Expose()
  classifications: string[];

  @Expose()
  @Type(() => BankTerritoryResponse)
  territories: BankTerritoryResponse[];

  @Expose()
  @Type(() => DepositConstraintResponse)
  deposits: DepositConstraintResponse;

  @Expose()
  loan_limit?: number;

  @Expose()
  has_loan_limit: boolean;

  @Expose()
  minimum_loan: number;

  @Expose()
  minimum_months_in_business: number;

  @Expose()
  minimum_daily_balance: number;

  @Expose()
  maximum_negative_days: number;

  @Expose()
  @Type(() => IndustryResponse)
  allowed_industries: IndustryResponse[];

  @Expose()
  supported_ids: string[];

  @Expose()
  positions: number[];

  @Expose()
  blocked_products: string[];
}
