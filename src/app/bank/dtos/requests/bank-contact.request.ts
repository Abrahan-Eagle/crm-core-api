import { Expose, Type } from 'class-transformer';

import { PhoneRequest } from '@/app/common';

export class BankContactRequest {
  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose({ name: 'phones' })
  @Type(() => PhoneRequest)
  phones: PhoneRequest[];

  @Expose()
  emails: string[];
}
