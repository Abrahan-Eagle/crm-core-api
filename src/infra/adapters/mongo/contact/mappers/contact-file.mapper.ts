import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { ContactDocument } from '@/domain/contact';

import { ContactFileDocument } from '../documents';

@Injectable()
export class ContactFileMapper extends AbstractMapper<ContactFileDocument, ContactDocument> {
  map(from: ContactFileDocument): ContactDocument {
    const ContactDocumentInstance = class extends ContactDocument {
      static load(): ContactDocument {
        return new ContactDocument(Id.load(from._id.toString()), from.name, from.type, from.created_at);
      }
    };
    return ContactDocumentInstance.load();
  }

  reverseMap(from: ContactDocument): ContactFileDocument {
    const doc = new ContactFileDocument();

    if (!from.id.isEmpty()) {
      doc._id = new Types.ObjectId(from.id.toString());
    }

    doc.name = from.name;
    doc.type = from.type;
    doc.created_at = from.createdAt;

    return doc;
  }
}
