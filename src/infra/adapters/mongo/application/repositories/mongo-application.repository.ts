import {
  Id,
  mapToVoid,
  Nullable,
  ObjectId,
  OptimisticLockingException,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { MONGO_ERRORS, MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, APPLICATION_STATUS, ApplicationRepository } from '@/domain/application';
import { ApplicationDuplicated, NotificationDuplicated } from '@/domain/common';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { ApplicationDocument } from '../documents';
import { ApplicationMapper } from '../mappers';

@Injectable()
export class MongoApplicationRepository implements ApplicationRepository {
  constructor(
    @InjectModel(InjectionConstant.APPLICATION_MODEL)
    private readonly model: Model<ApplicationDocument>,
    private readonly mapper: ApplicationMapper,
    private readonly context: MongoTransactionContextStorage,
    private readonly userContext: ExtendedAuthContextStorage,
  ) {}

  getLastApplication(companyId: ObjectId): Observable<Nullable<Application>> {
    return of(companyId).pipe(
      mergeMap(() =>
        this.model
          .findOne({
            company_id: new Types.ObjectId(companyId.toString()),
            tenant_id: this.userContext.store.tenantId,
          })
          .sort({ created_at: -1 }),
      ),
      map((application) => application && this.mapper.map(application)),
    );
  }

  findByTrackingId(trackingId: string): Observable<Nullable<Application>> {
    return of(trackingId).pipe(
      mergeMap((track_id) => this.model.findOne({ track_id, tenant_id: this.userContext.store.tenantId })),
      map((application) => application && this.mapper.map(application)),
    );
  }

  getAppsByCompanyId(period: string, companyId: ObjectId): Observable<Application[]> {
    return of(period).pipe(
      mergeMap((period) =>
        this.model
          .find({
            period,
            company_id: new Types.ObjectId(companyId.toString()),
          })
          .exec(),
      ),
      map((applications) => this.mapper.mapFromList(applications)),
    );
  }

  deleteMany(ids: Id[]): Observable<void> {
    return of({}).pipe(
      mergeMap(() =>
        this.model.deleteMany(
          {
            _id: {
              $in: ids.map((id) => new Types.ObjectId(id.toString())),
            },
          },
          { session: this.context.getStore()?.session },
        ),
      ),
      mapToVoid(),
    );
  }

  getActiveByPeriod(period: string, companyId: Id): Observable<Nullable<Application>> {
    return of(period).pipe(
      mergeMap((period) =>
        this.model.findOne({
          period,
          company_id: new Types.ObjectId(companyId.toString()),
          status: { $nin: [APPLICATION_STATUS.COMPLETED, APPLICATION_STATUS.REJECTED] },
          tenant_id: this.userContext.store.tenantId,
        }),
      ),
      map((application) => application && this.mapper.map(application)),
    );
  }

  getActiveApplications(period: string, companyId: Id): Observable<Application[]> {
    return of(period).pipe(
      mergeMap((period) =>
        this.model
          .find({
            period,
            company_id: new Types.ObjectId(companyId.toString()),
            status: { $nin: [APPLICATION_STATUS.COMPLETED, APPLICATION_STATUS.REJECTED] },
          })
          .exec(),
      ),
      map((applications) => this.mapper.mapFromList(applications)),
    );
  }

  updateOne(application: Application): Observable<void> {
    return of(application).pipe(
      map((application) => this.mapper.reverseMap(application)),
      mergeMap((applicationDocument) => {
        const { _id, version, ...update } = applicationDocument;
        return this.model.findOneAndUpdate({ _id, version, tenant_id: this.userContext.store.tenantId }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, Application not found for [Id:${application.id.toString()}], and [version:${
          application.version
        }]`;
        return new OptimisticLockingException(message);
      }),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new NotificationDuplicated());
        }
        return throwError(() => error);
      }),
      mapToVoid(),
    );
  }

  updateMany(applications: Application[]): Observable<void> {
    return of(applications).pipe(
      map((applications) => this.mapper.reverseMapFromList(applications)),
      mergeMap((appDocuments) =>
        this.model.bulkWrite(
          appDocuments.map((doc) => {
            const { _id, version, ...update } = doc;
            return {
              updateOne: {
                filter: { _id, version },
                update: update,
              },
            };
          }),
          { session: this.context.getStore()?.session },
        ),
      ),
      validateIf(
        (write) => write.matchedCount === applications.length,
        () => new OptimisticLockingException('The number of applications found does not match the requests'),
      ),
      mapToVoid(),
    );
  }

  saveForTenants(apps: { application: Application; tenant: string }[]): Observable<void> {
    return of(apps).pipe(
      map((apps) => this.mapper.reverseMapFromList(apps.map((val) => val.application))),

      mergeMap((docs) =>
        this.model.create(
          docs.map((doc, index) => ({ ...doc, tenant_id: apps[index].tenant })),
          {
            session: this.context.getStore()?.session,
          },
        ),
      ),
      mapToVoid(),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new ApplicationDuplicated());
        }
        return throwError(() => error);
      }),
    );
  }

  findById(id: Id): Observable<Nullable<Application>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.findOne({ _id, tenant_id: this.userContext.store.tenantId })),
      map((application) => application && this.mapper.map(application)),
    );
  }
}
