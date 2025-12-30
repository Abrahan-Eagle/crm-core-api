import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id } from '@/domain/common';
import { CallLog } from '@/domain/leads';

import { CallLogDocument } from '../documents';

@Injectable()
export class CallLogMapper extends AbstractMapper<CallLogDocument, CallLog> {
  map(from: CallLogDocument): CallLog {
    const CallLogInstance = class extends CallLog {
      static load(): CallLog {
        return new CallLog(Id.load(from.created_by.toString()), from.created_at);
      }
    };
    return CallLogInstance.load();
  }

  reverseMap(from: CallLog): CallLogDocument {
    const doc = new CallLogDocument();

    doc.created_by = new Types.ObjectId(from.createdBy.toString());
    doc.created_at = from.createdAt;

    return doc;
  }
}
