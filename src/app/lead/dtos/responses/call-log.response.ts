import { Expose, Type } from 'class-transformer';

import { UserResponse } from '@/app/user';

export class CallLogResponse {
  @Expose()
  @Type(() => UserResponse)
  created_by?: UserResponse;

  @Expose()
  created_at: Date;
}
