import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { CampaignContact } from '@/domain/campaign';
import { Id } from '@/domain/common';

import { CampaignContactDocument } from '../documents';

@Injectable()
export class CampaignContactMapper extends AbstractMapper<CampaignContactDocument, CampaignContact> {
  constructor() {
    super();
  }

  map(from: CampaignContactDocument): CampaignContact {
    const CampaignContactInstance = class extends CampaignContact {
      static load(): CampaignContact {
        return new CampaignContact(
          Id.load(from._id.toString()),
          Id.load(from.campaign_id.toString()),
          from.email,
          from.first_name,
          from.last_name,
          from.status,
          from.updated_at,
          from.version,
        );
      }
    };
    return CampaignContactInstance.load();
  }

  reverseMap(from: CampaignContact): CampaignContactDocument {
    const doc = new CampaignContactDocument();

    doc._id = new Types.ObjectId(from.contactId.isEmpty() ? undefined : from.contactId.toString());
    doc.campaign_id = new Types.ObjectId(from.campaignId.toString());
    doc.email = from.email;
    doc.first_name = from.firstName;
    doc.last_name = from.lastName;
    doc.status = from.status;
    doc.updated_at = from.updatedAt;
    doc.version = from.version ?? 0;

    return doc;
  }
}
