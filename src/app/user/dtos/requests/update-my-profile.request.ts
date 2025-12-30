import { Expose, Type } from 'class-transformer';

import { PhoneRequest } from '@/app/common';

export class UpdateMyProfileRequest {
  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose()
  @Type(() => PhoneRequest)
  phone: PhoneRequest;
}
