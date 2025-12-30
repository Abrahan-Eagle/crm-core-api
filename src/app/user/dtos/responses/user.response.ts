import { Expose, Type } from 'class-transformer';

import { PhoneResponse } from '@/app/common';
import { ExposeId, TransformDate } from '@/infra/common';

export class UserResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Expose()
  referral_id: string;

  @Expose()
  status: string;

  @Expose()
  tenants: string[];

  @Expose()
  @Type(() => PhoneResponse)
  phone: PhoneResponse;

  @Expose()
  roles: string[];

  @Expose()
  @TransformDate('YYYY-MM-DD')
  created_at: string;
}
