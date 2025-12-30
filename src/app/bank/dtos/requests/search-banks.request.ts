import { Expose } from 'class-transformer';

export class SearchBanksRequest {
  @Expose()
  search?: string;

  @Expose()
  territories?: string[];

  @Expose()
  status?: string;

  @Expose()
  bank_type?: string;

  @Expose()
  classifications?: string[];

  @Expose()
  countries?: string[];

  @Expose()
  deposits_minimum_transactions?: number;

  @Expose()
  deposits_minimum_amount?: number;

  @Expose()
  maximum_negative_days?: number;

  @Expose()
  minimum_daily_balance?: number;

  @Expose()
  loan_limit?: number;

  @Expose()
  minimum_months_in_business?: number;

  @Expose()
  supported_ids?: string[];

  @Expose()
  allowed_industries?: string[];

  @Expose()
  positions?: number[];

  @Expose()
  identification_types?: string[];

  @Expose()
  blacklisted?: boolean;
}
