import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { Company } from '@/domain/company';

import { AddressMapper, EmailMapper, IndustryMapper, NoteMapper, PhoneMapper, TaxIdMapper } from '../../common';
import { CompanyDocument } from '../documents';
import { CompanyFileMapper } from './company-file.mapper';
import { CompanyMemberMapper } from './company-member.mapper';

@Injectable()
export class CompanyMapper extends AbstractMapper<CompanyDocument, Company> {
  constructor(
    private readonly membersMapper: CompanyMemberMapper,
    private readonly addressMapper: AddressMapper,
    private readonly taxIdMapper: TaxIdMapper,
    private readonly phoneMapper: PhoneMapper,
    private readonly emailMapper: EmailMapper,
    private readonly fileMapper: CompanyFileMapper,
    private readonly industryMapper: IndustryMapper,
    private readonly noteMapper: NoteMapper,
  ) {
    super();
  }

  map(from: CompanyDocument): Company {
    const members = this.membersMapper.mapFromList(from.members);
    const address = this.addressMapper.map(from.address);
    const taxId = this.taxIdMapper.map(from.tax_id);
    const phoneNumbers = this.phoneMapper.mapFromList(from.phone_numbers);
    const emails = this.emailMapper.mapFromList(from.emails);
    const documents = this.fileMapper.mapFromList(from.documents);
    const industry = this.industryMapper.map(from.industry);
    const notes = this.noteMapper.mapFromList(from.notes);

    const CompanyInstance = class extends Company {
      static load(): Company {
        return new Company(
          Id.load(from._id.toString()),
          from.company_name,
          from.dba,
          taxId,
          industry,
          from.service,
          from.creation_date,
          from.entity_type,
          address,
          phoneNumbers,
          emails,
          members,
          documents,
          notes,
          from.created_by ? Id.load(from.created_by.toString()) : null,
          from.created_at,
          from.updated_at,
          from.version,
        );
      }
    };
    return CompanyInstance.load();
  }

  reverseMap(from: Company): CompanyDocument {
    const doc = new CompanyDocument();
    doc._id = new Types.ObjectId(from.id.toString());
    doc.company_name = from.companyName;
    doc.dba = from.dba;
    doc.tax_id = this.taxIdMapper.reverseMap(from.taxId);
    doc.industry = this.industryMapper.reverseMap(from.industry);
    doc.service = from.service;
    doc.creation_date = from.creationDate;
    doc.entity_type = from.entityType;
    doc.phone_numbers = this.phoneMapper.reverseMapFromList(from.phoneNumbers);
    doc.emails = this.emailMapper.reverseMapFromList(from.emails);
    doc.address = this.addressMapper.reverseMap(from.address);
    doc.members = this.membersMapper.reverseMapFromList(from.members);
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
