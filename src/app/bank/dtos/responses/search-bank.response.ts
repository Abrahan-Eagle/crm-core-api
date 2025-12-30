import { Expose, Type } from 'class-transformer';

import { ExposeId } from '@/infra/common';

import { DepositConstraintResponse } from './deposit-constraint.response';

export class SearchBankResponse {
  @ExposeId()
  id: string;

  @Expose()
  name: string;

  @Expose()
  bank_type: string;

  @Expose()
  manager: string;

  @Expose()
  country_iso_code_2: string;

  @Expose()
  classifications: string[];

  @Expose()
  territories: string[];

  @Expose()
  @Type(() => DepositConstraintResponse)
  deposits: DepositConstraintResponse;

  @Expose()
  loan_limit?: number;

  @Expose()
  has_loan_limit: boolean;

  @Expose()
  minimum_loan: boolean;

  @Expose()
  minimum_daily_balance: number;

  @Expose()
  maximum_negative_days: number;

  @Expose()
  status: string;

  @Expose()
  blacklisted: boolean;

  @Expose()
  blacklisted_at?: Date;

  @Expose()
  note?: string;
}
