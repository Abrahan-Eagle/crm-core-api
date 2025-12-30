import { Expose, Type } from 'class-transformer';

import { UserResponse } from '@/app/user';

export class DistributionResponse {
  @Expose()
  amount: number;

  @Expose()
  @Type(() => UserResponse)
  user: Partial<UserResponse>;
}
