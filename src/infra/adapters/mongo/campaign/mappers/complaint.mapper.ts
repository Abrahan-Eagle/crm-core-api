import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { ComplainedContact } from '@/domain/campaign';

import { ComplaintDocument } from '../documents';

@Injectable()
export class ComplaintMapper extends AbstractMapper<ComplaintDocument, ComplainedContact> {
  map(): ComplainedContact {
    throw new Error('Not implemented');
  }

  reverseMap(from: ComplainedContact): ComplaintDocument {
    const doc = new ComplaintDocument();

    doc._id = new Types.ObjectId();

    doc.type = from.type;
    doc.email = from.email;
    doc.created_at = from.createdAt;

    return doc;
  }
}
