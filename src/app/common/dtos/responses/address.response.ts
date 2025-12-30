import { Expose } from 'class-transformer';

export class AddressResponse {
  @Expose({ name: 'line_1' })
  address_line_1: string;

  @Expose({ name: 'line_2' })
  address_line_2?: string;

  @Expose()
  state: string;

  @Expose()
  city: string;

  @Expose()
  zip_code: string;

  @Expose()
  country_iso_code_2: string;
}
