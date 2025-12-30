import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { Industry } from '@/domain/common';

import { IndustryDocument } from '../documents';

@Injectable()
export class IndustryMapper extends AbstractMapper<IndustryDocument, Industry> {
  map(from: IndustryDocument): Industry {
    const IndustryInstance = class extends Industry {
      constructor() {
        super(from.name);
      }
    };
    return new IndustryInstance();
  }

  reverseMap(from: Industry): IndustryDocument {
    const doc = new IndustryDocument();

    doc.name = from.name;
    doc.id = from.id;

    return doc;
  }
}
