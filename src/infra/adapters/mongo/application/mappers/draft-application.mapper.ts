import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { DraftApplication } from '@/domain/application';
import { Id } from '@/domain/common';

import { DraftApplicationDocument } from '../documents';
import { ApplicationReferralMapper } from './application-referral.mapper';
import { DraftApplicationFileMapper } from './draft-application-file.mapper';

@Injectable()
export class DraftApplicationMapper extends AbstractMapper<DraftApplicationDocument, DraftApplication> {
  constructor(
    private readonly fileMapper: DraftApplicationFileMapper,
    private readonly referralMapper: ApplicationReferralMapper,
  ) {
    super();
  }

  map(from: DraftApplicationDocument): DraftApplication {
    const bankStatements = this.fileMapper.mapFromList(from.bank_statements);
    const referral = from.referral ? this.referralMapper.map(from.referral) : null;

    const DraftApplicationInstance = class extends DraftApplication {
      static load(): DraftApplication {
        return new DraftApplication(
          Id.load(from._id.toString()),
          Id.load(from.company_id.toString()),
          from.period,
          from.loan_amount,
          from.prospect_id,
          from.product,
          referral,
          bankStatements,
          from.signature_url,
          from.created_by ? Id.load(from.created_by.toString()) : null,
          from.created_at,
          from.updated_at,
          from.version,
        );
      }
    };
    return DraftApplicationInstance.load();
  }

  reverseMap(from: DraftApplication): DraftApplicationDocument {
    const doc = new DraftApplicationDocument();

    doc._id = new Types.ObjectId(from.id.toString());
    doc.company_id = new Types.ObjectId(from.companyId.toString());
    doc.period = from.period;
    doc.loan_amount = from.loanAmount;
    doc.prospect_id = from.prospectId;
    doc.product = from.product;
    doc.referral = from.referral ? this.referralMapper.reverseMap(from.referral) : null;
    doc.bank_statements = this.fileMapper.reverseMapFromList(from.bankStatements);
    doc.signature_url = from.signatureUrl;
    doc.created_at = from.createdAt;

    if (from.createdBy) {
      doc.created_by = new Types.ObjectId(from.createdBy.toString());
    }

    doc.updated_at = from.updatedAt;
    doc.version = from.version ?? 0;

    return doc;
  }
}
