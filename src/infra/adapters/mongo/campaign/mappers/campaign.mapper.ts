import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Campaign } from '@/domain/campaign';
import { Id } from '@/domain/common';

import { CampaignDocument } from '../documents';

@Injectable()
export class CampaignMapper extends AbstractMapper<CampaignDocument, Campaign> {
  constructor() {
    super();
  }

  map(from: CampaignDocument): Campaign {
    const CampaignContactInstance = class extends Campaign {
      static load(): Campaign {
        return new Campaign(
          Id.load(from._id.toString()),
          from.sender,
          from.subject,
          from.message,
          from.contacts,
          from.job_id,
        );
      }
    };
    return CampaignContactInstance.load();
  }

  reverseMap(from: Campaign): CampaignDocument {
    const doc = new CampaignDocument();

    doc._id = new Types.ObjectId(from.id.toString());

    doc.sender = from.sender;
    doc.message = from.message;
    doc.subject = from.subject;
    doc.job_id = from.jobId;
    doc.contacts = from.contacts;

    return doc;
  }
}
