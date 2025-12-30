import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { BankBlacklist } from '@/domain/bank';
import { Id } from '@/domain/common';

import { BankBlacklistDocument } from '../documents';

@Injectable()
export class BankBlacklistMapper extends AbstractMapper<BankBlacklistDocument, BankBlacklist> {
  map(from: BankBlacklistDocument): BankBlacklist {
    const BankBlacklistInstance = class extends BankBlacklist {
      static load(): BankBlacklist {
        return new BankBlacklist(from.blacklisted_at, Id.load(from.blacklisted_by.toString()), from.note);
      }
    };
    return BankBlacklistInstance.load();
  }

  reverseMap(from: BankBlacklist): BankBlacklistDocument {
    const doc = new BankBlacklistDocument();

    doc.blacklisted_at = from.blacklistedAt;
    doc.blacklisted_by = new Types.ObjectId(from.blacklistedBy.toString());
    doc.note = from.note;

    return doc;
  }
}
