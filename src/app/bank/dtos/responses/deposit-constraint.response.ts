import { Expose, Type } from 'class-transformer';

import { RestrictionsByIndustryResponse } from './restriction-by-industry.response';

export class DepositConstraintResponse {
  @Expose()
  minimum_amount: number;

  @Expose()
  minimum_transactions: number;

  @Expose()
  @Type(() => RestrictionsByIndustryResponse)
  by_industries: RestrictionsByIndustryResponse[];
}
