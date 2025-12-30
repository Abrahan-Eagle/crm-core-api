import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { Prospect } from '@/domain/leads';

import { NoteMapper, PhoneMapper } from '../../common';
import { ProspectDocument } from '../documents';
import { CallLogMapper } from './call-log.mapper';

@Injectable()
export class ProspectMapper extends AbstractMapper<ProspectDocument, Prospect> {
  constructor(
    private readonly phoneMapper: PhoneMapper,
    private readonly callLogMapper: CallLogMapper,
    private readonly noteMapper: NoteMapper,
  ) {
    super();
  }

  map(from: ProspectDocument): Prospect {
    const phone = this.phoneMapper.map(from.phone);
    const logs = this.callLogMapper.mapFromList(from.call_history);
    const notes = this.noteMapper.mapFromList(from.notes);
    const ProspectInstance = class extends Prospect {
      static load(): Prospect {
        return new Prospect(
          Id.load(from._id.toString()),
          Id.load(from.lead_group_id.toString()),
          from.company,
          from.name,
          from.email,
          phone,
          notes,
          logs,
          from.follow_up_call,
          from.updated_at,
        );
      }
    };
    return ProspectInstance.load();
  }

  reverseMap(from: Prospect): ProspectDocument {
    const doc = new ProspectDocument();

    if (from.id.isEmpty()) {
      doc._id = new Types.ObjectId();
    } else {
      doc._id = new Types.ObjectId(from.id.toString());
    }

    doc.lead_group_id = new Types.ObjectId(from.leadGoupId.toString());
    doc.company = from.company;
    doc.name = from.name;
    doc.email = from.email;
    doc.updated_at = from.updatedAt;
    doc.phone = this.phoneMapper.reverseMap(from.phone);
    doc.notes = this.noteMapper.reverseMapFromList(from.notes);
    doc.call_history = this.callLogMapper.reverseMapFromList(from.callHistory);
    doc.last_call = from.lastCall;
    doc.follow_up_call = from.followUpCall;

    return doc;
  }
}
