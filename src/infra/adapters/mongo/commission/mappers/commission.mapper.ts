import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Commission } from '@/domain/commission';
import { Id } from '@/domain/common';

import { CommissionDocument } from '../documents';
import { CommissionDetailMapper } from './commission-detail.mapper';

@Injectable()
export class CommissionMapper extends AbstractMapper<CommissionDocument, Commission> {
  constructor(private readonly commissionDetailMapper: CommissionDetailMapper) {
    super();
  }

  map(from: CommissionDocument): Commission {
    return new Commission(
      Id.load(from._id.toString()),
      Id.load(from.application_id.toString()),
      Id.load(from.company_id.toString()),
      Id.load(from.bank_id.toString()),
      from.status,
      this.commissionDetailMapper.map(from.commission),
      this.commissionDetailMapper.map(from.psf),
      from.created_at,
      from.updated_at,
      from.version,
    );
  }

  reverseMap(from: Commission): CommissionDocument {
    const doc = new CommissionDocument();

    if (!from.id.isEmpty()) {
      doc._id = new Types.ObjectId(from.id.toString());
    }

    doc.application_id = new Types.ObjectId(from.applicationId.toString());
    doc.company_id = new Types.ObjectId(from.companyId.toString());
    doc.bank_id = new Types.ObjectId(from.bankId.toString());

    doc.commission = this.commissionDetailMapper.reverseMap(from.commission);
    doc.psf = this.commissionDetailMapper.reverseMap(from.psf);

    doc.status = from.status;
    doc.created_at = from.createdAt;
    doc.updated_at = from.updatedAt;
    doc.version = from.version ?? 0;

    return doc;
  }
}
