import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Distribution } from '@/domain/commission';
import { Id } from '@/domain/common';

import { DistributionDocument } from '../documents';

@Injectable()
export class DistributionMapper extends AbstractMapper<DistributionDocument, Distribution> {
  map(from: DistributionDocument): Distribution {
    return new Distribution(Id.load(from.user_id.toString()), from.amount);
  }

  reverseMap(from: Distribution): DistributionDocument {
    const doc = new DistributionDocument();

    doc.user_id = new Types.ObjectId(from.userId.toString());
    doc.amount = from.amount;

    return doc;
  }
}
