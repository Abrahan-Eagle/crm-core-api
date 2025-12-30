import { Expose } from 'class-transformer';

export class AddressRequest {
  @Expose({ name: 'address_line_1' })
  addressLine1: string;

  @Expose({ name: 'address_line_2' })
  addressLine2: string;

  @Expose()
  state: string;

  @Expose()
  city: string;

  @Expose({ name: 'zip_code' })
  zipCode: string;

  @Expose({ name: 'country_iso_code_2' })
  countryIsoCode2: string;
}
