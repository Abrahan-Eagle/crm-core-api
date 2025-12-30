import { AbstractMapper } from '@internal/common';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { Id, Note } from '@/domain/common';

import { NoteDocument } from '../documents';

@Injectable()
export class NoteMapper extends AbstractMapper<NoteDocument, Note> {
  map(from: NoteDocument): Note {
    const NoteInstance = class extends Note {
      constructor() {
        super(
          Id.load(from._id.toString()),
          Id.load(from.author.toString()),
          from.level,
          from.description,
          from.created_at,
        );
      }
    };
    return new NoteInstance();
  }

  reverseMap(from: Note): NoteDocument {
    const doc = new NoteDocument();

    doc._id = new Types.ObjectId(from.id.toString());
    doc.author = new Types.ObjectId(from.author.toString());
    doc.level = from.level;
    doc.description = from.description;
    doc.created_at = from.createdAt;

    return doc;
  }
}
