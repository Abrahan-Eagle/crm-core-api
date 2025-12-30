import { Expose, Type } from 'class-transformer';

class DistributionRequest {
  @Expose()
  amount: number;

  @Expose({ name: 'user_id' })
  userId: string;
}

class CommissionDetailRequest {
  @Expose()
  total: number;

  @Expose()
  @Type(() => DistributionRequest)
  distribution: DistributionRequest[];
}

export class UpdateCommissionRequest {
  @Expose()
  @Type(() => CommissionDetailRequest)
  commission: CommissionDetailRequest;

  @Expose()
  @Type(() => CommissionDetailRequest)
  psf: CommissionDetailRequest;
}
