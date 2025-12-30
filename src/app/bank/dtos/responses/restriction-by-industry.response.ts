import { Expose, Type } from 'class-transformer';

import { IndustryResponse } from '@/app/common';

export class RestrictionsByIndustryResponse {
  @Expose()
  minimum_amount: number;

  @Expose()
  minimum_transactions: number;

  @Expose()
  @Type(() => IndustryResponse)
  industry: IndustryResponse;
}
