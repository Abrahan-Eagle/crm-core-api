import { Expose, Transform, Type } from 'class-transformer';

import { PhoneResponse } from '@/app/common';
import { UserResponse } from '@/app/user';
import { ExposeId, HideEmailTransformer } from '@/infra/common';

export class SearchContactResponse {
  @ExposeId()
  id: string;

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

  @Expose()
  country_iso_code_2: string;

  @Expose()
  created_at: string;

  @Expose()
  @Type(() => UserResponse)
  created_by?: UserResponse;
}
