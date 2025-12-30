import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { BankContact } from '@/domain/bank/entities';

import { EmailMapper, PhoneMapper } from '../../common';
import { BankContactDocument } from '../documents';

@Injectable()
export class BankContactMapper extends AbstractMapper<BankContactDocument, BankContact> {
  constructor(
    private readonly phoneMapper: PhoneMapper,
    private readonly emailMapper: EmailMapper,
  ) {
    super();
  }

  map(from: BankContactDocument): BankContact {
    const phoneNumbers = this.phoneMapper.mapFromList(from.phones);
    const emails = this.emailMapper.mapFromList(from.emails);

    const BankContactInstance = class extends BankContact {
      static load() {
        return new BankContact(from.first_name, from.last_name, phoneNumbers, emails);
      }
    };
    return BankContactInstance.load();
  }

  reverseMap(from: BankContact): BankContactDocument {
    const doc = new BankContactDocument();
    doc.emails = this.emailMapper.reverseMapFromList(from.emails);
    doc.phones = this.phoneMapper.reverseMapFromList(from.phones);
    doc.first_name = from.firstName;
    doc.last_name = from.lastName;
    return doc;
  }
}
