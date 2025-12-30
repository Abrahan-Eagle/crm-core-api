import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { DraftApplicationDocument } from '@/domain/application';

import { DraftApplicationFileDocument } from '../documents';

@Injectable()
export class DraftApplicationFileMapper extends AbstractMapper<DraftApplicationFileDocument, DraftApplicationDocument> {
  map(from: DraftApplicationFileDocument): DraftApplicationDocument {
    const ApplicationFileInstance = class extends DraftApplicationDocument {
      static load(): DraftApplicationDocument {
        return new DraftApplicationDocument(
          from.name,
          from.amount,
          from.transactions,
          from.negative_days,
          from.period,
          null,
        );
      }
    };
    return ApplicationFileInstance.load();
  }

  reverseMap(from: DraftApplicationDocument): DraftApplicationFileDocument {
    const doc = new DraftApplicationFileDocument();

    doc.name = from.name;
    doc.amount = from.amount;
    doc.transactions = from.transactions;
    doc.negative_days = from.negativeDays;
    doc.period = from.period;

    return doc;
  }
}
