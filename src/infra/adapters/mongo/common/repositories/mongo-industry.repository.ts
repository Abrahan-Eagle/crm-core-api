import { mapToVoid } from '@internal/common';
import { MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Industry, IndustryRepository } from '@/domain/common';

import { IndustryDocument } from '../documents';
import { IndustryMapper } from '../mappers';

@Injectable()
export class MongoIndustryRepository implements IndustryRepository {
  constructor(
    @InjectModel(InjectionConstant.INDUSTRY_MODEL)
    private readonly model: Model<IndustryDocument>,
    private readonly mapper: IndustryMapper,
    private readonly context: MongoTransactionContextStorage,
  ) {}

  upsert(industries: Industry[]): Observable<void> {
    return of(industries).pipe(
      map((industries) => this.mapper.reverseMapFromList(industries)),
      mergeMap((documents) =>
        this.model.bulkWrite(
          documents.map((document) => ({
            replaceOne: {
              filter: { id: document.id },
              replacement: document,
              upsert: true,
            },
          })),
          {
            session: this.context.getStore()?.session,
          },
        ),
      ),
      mapToVoid(),
    );
  }
}
