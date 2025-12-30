import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { BankDocument } from '@/domain/bank';
import { Id } from '@/domain/common';

import { BankFileDocument } from '../documents';

@Injectable()
export class BankFileMapper extends AbstractMapper<BankFileDocument, BankDocument> {
  map(from: BankFileDocument): BankDocument {
    const BankDocumentInstance = class extends BankDocument {
      static load(): BankDocument {
        return new BankDocument(Id.load(from._id.toString()), from.name, from.created_at);
      }
    };
    return BankDocumentInstance.load();
  }

  reverseMap(from: BankDocument): BankFileDocument {
    const doc = new BankFileDocument();

    if (!from.id.isEmpty()) {
      doc._id = new Types.ObjectId(from.id.toString());
    }

    doc.name = from.name;
    doc.created_at = from.createdAt;

    return doc;
  }
}
