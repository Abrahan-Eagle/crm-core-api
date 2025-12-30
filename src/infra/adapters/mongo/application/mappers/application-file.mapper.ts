import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { ApplicationDocument } from '@/domain/application';

import { ApplicationFileDocument } from '../documents';

@Injectable()
export class ApplicationFileMapper extends AbstractMapper<ApplicationFileDocument, ApplicationDocument> {
  map(from: ApplicationFileDocument): ApplicationDocument {
    const ApplicationFileInstance = class extends ApplicationDocument {
      static load(): ApplicationDocument {
        return new ApplicationDocument(
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

  reverseMap(from: ApplicationDocument): ApplicationFileDocument {
    const doc = new ApplicationFileDocument();

    doc.name = from.name;
    doc.amount = from.amount;
    doc.transactions = from.transactions;
    doc.negative_days = from.negativeDays;
    doc.period = from.period;

    return doc;
  }
}
