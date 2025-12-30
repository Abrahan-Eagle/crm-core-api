import { mapToVoid, Nullable, OptimisticLockingException, throwIfVoid } from '@internal/common';
import { MONGO_ERRORS, MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { DraftApplication, DraftApplicationRepository } from '@/domain/application';
import { ApplicationDuplicated, Id } from '@/domain/common';

import { DraftApplicationDocument } from '../documents';
import { DraftApplicationMapper } from '../mappers';

@Injectable()
export class MongoDraftApplicationRepository implements DraftApplicationRepository {
  constructor(
    @InjectModel(InjectionConstant.DRAFT_APPLICATION_MODEL)
    private readonly model: Model<DraftApplicationDocument>,
    private readonly mapper: DraftApplicationMapper,
    private readonly context: MongoTransactionContextStorage,
  ) {}

  saveOne(draft: DraftApplication): Observable<void> {
    return of(draft).pipe(
      map((app) => this.mapper.reverseMap(app)),
      mergeMap((doc) => this.model.create([doc], { session: this.context.getStore()?.session })),
      mapToVoid(),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new ApplicationDuplicated());
        }
        return throwError(() => error);
      }),
    );
  }

  getActiveByPeriod(period: string, companyId: Id): Observable<Nullable<DraftApplication>> {
    return of(period).pipe(
      mergeMap((period) =>
        this.model
          .find({
            period,
            company_id: new Types.ObjectId(companyId.toString()),
          })
          .exec(),
      ),
      map(([application]) => application && this.mapper.map(application)),
    );
  }

  findById(id: Id): Observable<Nullable<DraftApplication>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.findOne({ _id })),
      map((application) => application && this.mapper.map(application)),
    );
  }

  deleteById(id: Id): Observable<void> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.deleteOne({ _id }, { session: this.context.getStore()?.session })),
      mapToVoid(),
    );
  }

  updateOne(application: DraftApplication): Observable<void> {
    return of(application).pipe(
      map((application) => this.mapper.reverseMap(application)),
      mergeMap((applicationDocument) => {
        const { _id, version, ...update } = applicationDocument;
        return this.model.findOneAndUpdate({ _id, version }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, Draft Application not found for [Id:${application.id.toString()}], and [version:${
          application.version
        }]`;
        return new OptimisticLockingException(message);
      }),
      mapToVoid(),
    );
  }
}
