import { Expose, Type } from 'class-transformer';

import { UserResponse } from '@/app/user';
import { ExposeId } from '@/infra/common';

export class SearchLeadResponse {
  @ExposeId()
  id: string;

  @Expose()
  name: string;

  @Expose({ name: 'prospect_count' })
  prospects: number;

  @Expose()
  created_at: string;

  @Expose()
  @Type(() => UserResponse)
  created_by: UserResponse;

  @Expose()
  @Type(() => UserResponse)
  assigned_to: UserResponse;
}
