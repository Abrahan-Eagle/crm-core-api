import { mapToVoid, Nullable, ObjectId, OptimisticLockingException, throwIfVoid } from '@internal/common';
import { MONGO_ERRORS, MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Commission, CommissionRepository } from '@/domain/commission';
import { CommissionDuplicated } from '@/domain/common';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { CommissionDocument } from '../documents';
import { CommissionMapper } from '../mappers';

@Injectable()
export class MongoCommissionRepository implements CommissionRepository {
  constructor(
    @InjectModel(InjectionConstant.COMMISSION_MODEL)
    private readonly model: Model<CommissionDocument>,
    private readonly mapper: CommissionMapper,
    private readonly context: MongoTransactionContextStorage,
    private readonly userContext: ExtendedAuthContextStorage,
  ) {}

  findById(id: ObjectId): Observable<Nullable<Commission>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.findOne({ _id, tenant_id: this.userContext.store.tenantId })),
      map((commission) => commission && this.mapper.map(commission)),
    );
  }

  updateOne(commission: Commission): Observable<void> {
    return of(commission).pipe(
      map((commission) => this.mapper.reverseMap(commission)),
      mergeMap((commissionDocument) => {
        const { _id, version, ...update } = commissionDocument;
        return this.model.findOneAndUpdate({ _id, version, tenant_id: this.userContext.store.tenantId }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, Commission not found for [Id:${commission.id.toString()}], and [version:${
          commission.version
        }]`;
        return new OptimisticLockingException(message);
      }),
      mapToVoid(),
    );
  }

  createOne(commission: Commission): Observable<void> {
    return of(commission).pipe(
      map((commission) => this.mapper.reverseMap(commission)),
      mergeMap((commissionDocument) =>
        this.model.create([{ ...commissionDocument, tenant_id: this.userContext.store.tenantId }], {
          session: this.context.getStore()?.session,
        }),
      ),
      mapToVoid(),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new CommissionDuplicated());
        }
        return throwError(() => error);
      }),
    );
  }
}
