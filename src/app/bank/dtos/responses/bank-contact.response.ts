import { Expose, Transform, Type } from 'class-transformer';

import { PhoneResponse } from '@/app/common';
import { HideEmailTransformer } from '@/infra/common';

export class BankContactResponse {
  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  @Type(() => PhoneResponse)
  phones: PhoneResponse[];

  @Expose()
  @Transform(HideEmailTransformer())
  emails: string[];
}
