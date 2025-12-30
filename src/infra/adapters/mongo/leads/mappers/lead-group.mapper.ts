import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { LeadGroup } from '@/domain/leads';

import { LeadGroupDocument } from '../documents';

@Injectable()
export class LeadGroupMapper extends AbstractMapper<LeadGroupDocument, LeadGroup> {
  map(from: LeadGroupDocument): LeadGroup {
    const LeadGroupInstance = class extends LeadGroup {
      static load(): LeadGroup {
        return new LeadGroup(
          Id.load(from._id.toString()),
          from.name,
          from.prospect_count,
          Id.load(from.assigned_to.toString()),
          Id.load(from.created_by.toString()),
          from.created_at,
        );
      }
    };
    return LeadGroupInstance.load();
  }

  reverseMap(from: LeadGroup): LeadGroupDocument {
    const doc = new LeadGroupDocument();
    doc._id = new Types.ObjectId(from.id.toString());

    doc.name = from.name;
    doc.prospect_count = from.prospectCount;
    doc.assigned_to = new Types.ObjectId(from.assignedTo.toString());
    doc.created_by = new Types.ObjectId(from.createdBy.toString());
    doc.created_at = from.createdAt;

    return doc;
  }
}
