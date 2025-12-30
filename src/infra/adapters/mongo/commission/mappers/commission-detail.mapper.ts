import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { CommissionDetail } from '@/domain/commission';

import { CommissionDetailDocument } from '../documents';
import { DistributionMapper } from './distribution.mapper';

@Injectable()
export class CommissionDetailMapper extends AbstractMapper<CommissionDetailDocument, CommissionDetail> {
  constructor(private readonly distributionMapper: DistributionMapper) {
    super();
  }

  map(from: CommissionDetailDocument): CommissionDetail {
    return new CommissionDetail(from.total, this.distributionMapper.mapFromList(from.distribution), from.blocked);
  }

  reverseMap(from: CommissionDetail): CommissionDetailDocument {
    const doc = new CommissionDetailDocument();

    doc.total = from.total;
    doc.earnings = from.earnings;
    doc.blocked = from.blocked;
    doc.distribution = this.distributionMapper.reverseMapFromList(from.distribution);

    return doc;
  }
}
