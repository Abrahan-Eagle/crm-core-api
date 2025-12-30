import { Expose, Type } from 'class-transformer';

import { DistributionResponse } from './distribution.response';

export class CommissionDetailsResponse {
  @Expose()
  @Type(() => DistributionResponse)
  distribution: DistributionResponse[];

  @Expose()
  total: number;
}
