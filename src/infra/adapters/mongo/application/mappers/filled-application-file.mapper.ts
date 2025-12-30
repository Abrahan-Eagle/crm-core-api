import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';

import { FilledApplicationDocument } from '@/domain/application';

import { FilledApplicationFileDocument } from '../documents';

@Injectable()
export class FilledApplicationFileMapper extends AbstractMapper<
  FilledApplicationFileDocument,
  FilledApplicationDocument
> {
  map(from: FilledApplicationFileDocument): FilledApplicationDocument {
    const ApplicationFileInstance = class extends FilledApplicationDocument {
      static load(): FilledApplicationDocument {
        return new FilledApplicationDocument(from.name, null);
      }
    };
    return ApplicationFileInstance.load();
  }

  reverseMap(from: FilledApplicationDocument): FilledApplicationFileDocument {
    const doc = new FilledApplicationFileDocument();
    doc.name = from.name;
    return doc;
  }
}
