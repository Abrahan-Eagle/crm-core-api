import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { CompanyMember } from '@/domain/company';

import { CompanyMemberDocument } from '../documents';

@Injectable()
export class CompanyMemberMapper extends AbstractMapper<CompanyMemberDocument, CompanyMember> {
  constructor() {
    super();
  }

  map(from: CompanyMemberDocument): CompanyMember {
    const CompanyMemberInstance = class extends CompanyMember {
      static load(): CompanyMember {
        return new CompanyMember(Id.load(from.contact_id.toString()), from.title, from.percentage, from.member_since);
      }
    };
    return CompanyMemberInstance.load();
  }

  reverseMap(from: CompanyMember): CompanyMemberDocument {
    const doc = new CompanyMemberDocument();
    doc.contact_id = new Types.ObjectId(from.contactId.toString());
    doc.title = from.title;
    doc.percentage = from.percentage;
    doc.member_since = from.memberSince;
    return doc;
  }
}
