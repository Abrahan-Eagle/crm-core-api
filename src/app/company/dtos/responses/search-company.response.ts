import { Expose, Transform, Type } from 'class-transformer';

import { PhoneResponse } from '@/app/common';
import { UserResponse } from '@/app/user';
import { ExposeId, HideTaxIdTransformer, TransformDate } from '@/infra/common';

export class SearchCompanyResponse {
  @ExposeId()
  id: string;

  @Expose()
  name: string;

  @Expose()
  dba?: string;

  @Expose()
  @Transform(HideTaxIdTransformer())
  tax_id: string;

  @Expose()
  country_iso_code_2: string;

  @Expose()
  @Type(() => PhoneResponse)
  phone_numbers: PhoneResponse[];

  @Expose()
  @TransformDate('YYYY-MM-DD')
  creation_date: string;

  @Expose()
  created_at: string;

  @Expose()
  @Type(() => UserResponse)
  created_by?: UserResponse;
}
