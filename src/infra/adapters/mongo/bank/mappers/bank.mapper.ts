import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Bank } from '@/domain/bank/entities';
import { Id } from '@/domain/common';

import { AddressMapper } from '../../common';
import { BankDocument } from '../documents';
import { BankBlacklistMapper } from './bank-blacklist.mapper';
import { BankConstraintsMapper } from './bank-constraints.mapper';
import { BankContactMapper } from './bank-contact.mapper';
import { BankFileMapper } from './bank-file.mapper';

@Injectable()
export class BankMapper extends AbstractMapper<BankDocument, Bank> {
  constructor(
    private readonly constrainsMapper: BankConstraintsMapper,
    private readonly contactInfoMapper: BankContactMapper,
    private readonly addressMapper: AddressMapper,
    private readonly fileMapper: BankFileMapper,
    private readonly blacklistMapper: BankBlacklistMapper,
  ) {
    super();
  }

  map(from: BankDocument): Bank {
    const contacts = this.contactInfoMapper.mapFromList(from.contacts);
    const address = this.addressMapper.map(from.address);
    const constraints = this.constrainsMapper.map(from.constraints);
    const files = this.fileMapper.mapFromList(from.documents);
    const blacklist = from.blacklist ? this.blacklistMapper.map(from.blacklist) : null;

    const BankInstance = class extends Bank {
      static load(): Bank {
        return new Bank(
          Id.load(from._id.toString()),
          from.bank_name,
          from.manager,
          from.status,
          address,
          contacts,
          constraints,
          files,
          from.bank_type,
          blacklist,
          from.created_at,
          from.updated_at,
          from.version,
        );
      }
    };
    return BankInstance.load();
  }

  reverseMap(from: Bank): BankDocument {
    const doc = new BankDocument();

    doc._id = new Types.ObjectId(from.id.toString());
    doc.bank_name = from.bankName;
    doc.manager = from.manager;
    doc.status = from.status;
    doc.bank_type = from.bankType;
    doc.address = this.addressMapper.reverseMap(from.address);
    doc.contacts = this.contactInfoMapper.reverseMapFromList(from.contacts);
    doc.constraints = this.constrainsMapper.reverseMap(from.constraints);
    doc.documents = this.fileMapper.reverseMapFromList(from.documents);
    doc.blacklist = from.blacklist ? this.blacklistMapper.reverseMap(from.blacklist) : null;
    doc.created_at = from.createdAt;
    doc.updated_at = from.updatedAt;
    doc.version = from.version ?? 0;

    return doc;
  }
}
