import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { CompanyDocument } from '@/domain/company';

import { CompanyFileDocument } from '../documents';

@Injectable()
export class CompanyFileMapper extends AbstractMapper<CompanyFileDocument, CompanyDocument> {
  map(from: CompanyFileDocument): CompanyDocument {
    const CompanyDocumentInstance = class extends CompanyDocument {
      static load(): CompanyDocument {
        return new CompanyDocument(Id.load(from._id.toString()), from.name, from.type, from.created_at);
      }
    };
    return CompanyDocumentInstance.load();
  }

  reverseMap(from: CompanyDocument): CompanyFileDocument {
    const doc = new CompanyFileDocument();

    if (!from.id.isEmpty()) {
      doc._id = new Types.ObjectId(from.id.toString());
    }

    doc.name = from.name;
    doc.type = from.type;
    doc.created_at = from.createdAt;

    return doc;
  }
}
