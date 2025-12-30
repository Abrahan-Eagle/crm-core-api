import { AbstractMapper, Phone } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { PhoneDocument } from '../documents';

@Injectable()
export class PhoneMapper extends AbstractMapper<PhoneDocument, Phone> {
  map(from: PhoneDocument): Phone {
    const PhoneInstance = class extends Phone {
      constructor() {
        super(from.intl_prefix, from.region_code, from.number);
      }
    };
    return new PhoneInstance();
  }

  reverseMap(from: Phone): PhoneDocument {
    const doc = new PhoneDocument();

    doc.intl_prefix = from.intlPrefix;
    doc.region_code = from.regionCode;
    doc.number = from.number;

    return doc;
  }
}
