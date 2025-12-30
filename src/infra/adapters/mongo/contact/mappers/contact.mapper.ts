import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { Contact } from '@/domain/contact';

import { AddressMapper, EmailMapper, NoteMapper, PhoneMapper } from '../../common';
import { ContactDocument } from '../documents';
import { ContactFileMapper } from './contact-file.mapper';

@Injectable()
export class ContactMapper extends AbstractMapper<ContactDocument, Contact> {
  constructor(
    private readonly addressMapper: AddressMapper,
    private readonly phoneMapper: PhoneMapper,
    private readonly emailMapper: EmailMapper,
    private readonly fileMapper: ContactFileMapper,
    private readonly noteMapper: NoteMapper,
  ) {
    super();
  }

  map(from: ContactDocument): Contact {
    const address = this.addressMapper.map(from.address);
    const phones = this.phoneMapper.mapFromList(from.phones);
    const emails = this.emailMapper.mapFromList(from.emails);
    const documents = this.fileMapper.mapFromList(from.documents);
    const notes = this.noteMapper.mapFromList(from.notes);
    const ContactInstance = class extends Contact {
      static load(): Contact {
        return new Contact(
          Id.load(from._id.toString()),
          from.first_name,
          from.last_name,
          from.birthdate,
          from.ssn,
          address,
          phones,
          emails,
          documents,
          notes,
          from.created_by ? Id.load(from.created_by.toString()) : null,
          from.created_at,
          from.updated_at,
          from.version,
        );
      }
    };
    return ContactInstance.load();
  }

  reverseMap(from: Contact): ContactDocument {
    const doc = new ContactDocument();
    doc._id = new Types.ObjectId(from.id.toString());
    doc.first_name = from.firstName;
    doc.last_name = from.lastName;
    doc.birthdate = from.birthdate;
    doc.ssn = from.ssn;
    doc.identification_type = from.identificationType;
    doc.address = this.addressMapper.reverseMap(from.address);
    doc.phones = this.phoneMapper.reverseMapFromList(from.phones);
    doc.emails = this.emailMapper.reverseMapFromList(from.emails);
    doc.documents = this.fileMapper.reverseMapFromList(from.documents);
    doc.notes = this.noteMapper.reverseMapFromList(from.notes);
    if (from.createdBy) {
      doc.created_by = new Types.ObjectId(from.createdBy.toString());
    }
    doc.created_at = from.createdAt;
    doc.updated_at = from.updatedAt;
    doc.version = from.version ?? 0;
    return doc;
  }
}
