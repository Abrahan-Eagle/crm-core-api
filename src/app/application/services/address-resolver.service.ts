import { Address, Nullable } from '@internal/common';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { DemographicsService } from '@/domain/common';

@Injectable()
export class AddressResolver {
  constructor(
    @Inject(InjectionConstant.DEMOGRAPHICS_SERVICE)
    private readonly demographics: DemographicsService,
  ) {}

  public async resolve(value: Address): Promise<{
    address?: Nullable<string>;
    city?: Nullable<string>;
    zip_code?: Nullable<string>;
    state?: Nullable<string>;
    country?: Nullable<string>;
  }> {
    let address = `${value.addressLine1}`;
    if (value.addressLine2) {
      address += `, ${value.addressLine2}`;
    }

    let country = value.countryIsoCode2;
    let state = value.state;

    const countries = this.demographics.allCountries();

    if (countries[value.countryIsoCode2]) {
      country = countries[value.countryIsoCode2];

      const states = (await firstValueFrom(this.demographics.getStates(country)).catch(() => {})) as Record<
        string,
        string
      >;

      if (state && states[state]) {
        state = states[state];
      }
    }

    return {
      address,
      city: value.city,
      zip_code: value.zipCode,
      state,
      country,
    };
  }
}
