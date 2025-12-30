import { mapToVoid, Nullable, OptimisticLockingException, throwIfVoid } from '@internal/common';
import { MONGO_ERRORS, MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { ContactDuplicated, FileDuplicated, Id } from '@/domain/common';
import { Contact, ContactRepository } from '@/domain/contact';

import { ContactDocument } from '../documents';
import { ContactMapper } from '../mappers';

@Injectable()
export class MongoContactRepository implements ContactRepository {
  constructor(
    @InjectModel(InjectionConstant.CONTACT_MODEL)
    private readonly model: Model<ContactDocument>,
    private readonly mapper: ContactMapper,
    private readonly context: MongoTransactionContextStorage,
  ) {}

  createOne(contact: Contact): Observable<void> {
    return of(contact).pipe(
      map((contact) => this.mapper.reverseMap(contact)),
      mergeMap((ContactDocument) =>
        this.model.create([ContactDocument], { session: this.context.getStore()?.session }),
      ),
      mapToVoid(),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new ContactDuplicated());
        }
        return throwError(() => error);
      }),
    );
  }

  findById(id: Id): Observable<Nullable<Contact>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.findOne({ _id })),
      map((contact) => contact && this.mapper.map(contact)),
    );
  }

  updateOne(contact: Contact): Observable<void> {
    return of(contact).pipe(
      map((contact) => this.mapper.reverseMap(contact)),
      mergeMap((contactDocument) => {
        const { _id, version, ...update } = contactDocument;
        return this.model.findOneAndUpdate({ _id, version }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, Contact not found for [Id:${contact.id.toString()}], and [version:${
          contact.version
        }]`;
        return new OptimisticLockingException(message);
      }),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new FileDuplicated());
        }
        return throwError(() => error);
      }),
      mapToVoid(),
    );
  }

  findMany(ids: Id[]): Observable<Contact[]> {
    const toMongoIds = ids.map((id) => new Types.ObjectId(id.toString()));
    return of(toMongoIds).pipe(
      mergeMap((ids) => this.model.aggregate<ContactDocument>([{ $match: { _id: { $in: ids } } }]).exec()),
      map((docs) => this.mapper.mapFromList(docs)),
    );
  }
}
