import { Expose } from 'class-transformer';

export class PhoneRequest {
  @Expose({ name: 'intl_prefix' })
  intlPrefix: string;

  @Expose({ name: 'region_code' })
  regionCode: string;

  @Expose()
  number: string;
}
