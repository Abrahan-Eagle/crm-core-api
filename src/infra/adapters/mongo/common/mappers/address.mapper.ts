import { AbstractMapper, Address } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { AddressDocument } from '../documents';

@Injectable()
export class AddressMapper extends AbstractMapper<AddressDocument, Address> {
  map(from: AddressDocument): Address {
    const AddressInstance = class extends Address {
      constructor() {
        super(from.line_1, from.line_2, from.state, from.city, from.zip_code, from.country_iso_code_2);
      }
    };

    return new AddressInstance();
  }

  reverseMap(from: Address): AddressDocument {
    const doc = new AddressDocument();

    doc.line_1 = from.addressLine1;
    doc.line_2 = from.addressLine2;
    doc.state = from.state;
    doc.city = from.city;
    doc.zip_code = from.zipCode;
    doc.country_iso_code_2 = from.countryIsoCode2;

    return doc;
  }
}
