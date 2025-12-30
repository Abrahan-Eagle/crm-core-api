import { Email, mapToVoid, Nullable, OptimisticLockingException, throwIfVoid } from '@internal/common';
import { MONGO_ERRORS, MongoTransactionContextStorage } from '@internal/mongo';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, delayWhen, map, mergeMap, Observable, of, throwError } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Bank, BankRepository } from '@/domain/bank';
import { BankDuplicated, FileDuplicated, Id, IndustryRepository } from '@/domain/common';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { BankDocument } from '../documents';
import { BankMapper } from '../mappers';

@Injectable()
export class MongoBankRepository implements BankRepository {
  constructor(
    @InjectModel(InjectionConstant.BANK_MODEL)
    private readonly model: Model<BankDocument>,
    private readonly mapper: BankMapper,
    private readonly context: MongoTransactionContextStorage,
    private readonly userContext: ExtendedAuthContextStorage,
    @Inject(InjectionConstant.INDUSTRY_REPOSITORY)
    private readonly industryRepository: IndustryRepository,
  ) {}

  findByContactEmail(email: Email): Observable<Nullable<Bank>> {
    return of(email).pipe(
      map((email) => email.value),
      mergeMap((value) =>
        this.model.findOne({
          $or: [
            { 'contacts.emails.value': value },
            { 'contacts.emails.value': { $regex: value.split('@').at(-1)?.toLowerCase() } },
          ],
          tenant_id: this.userContext.store.tenantId,
        }),
      ),
      map((bank) => bank && this.mapper.map(bank)),
    );
  }

  createOne(bank: Bank): Observable<void> {
    return of(bank).pipe(
      delayWhen((bank) =>
        this.industryRepository.upsert([
          ...bank.constraints.allowedIndustries,
          ...(bank.constraints.deposits?.byIndustries.map((rule) => rule.industry) ?? []),
        ]),
      ),
      map((bank) => this.mapper.reverseMap(bank)),
      mergeMap((bankDocument) =>
        this.model.create([{ ...bankDocument, tenant_id: this.userContext.store.tenantId }], {
          session: this.context.getStore()?.session,
        }),
      ),
      mapToVoid(),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new BankDuplicated());
        }
        return throwError(() => error);
      }),
    );
  }

  findById(id: Id): Observable<Nullable<Bank>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.findOne({ _id, tenant_id: this.userContext.store.tenantId })),
      map((bank) => bank && this.mapper.map(bank)),
    );
  }

  findManyById(ids: Id[]): Observable<Bank[]> {
    return of(ids).pipe(
      map((ids) => ids.map((id) => new Types.ObjectId(id.toString()))),
      mergeMap((_ids) => this.model.find({ _id: { $in: _ids }, tenant_id: this.userContext.store.tenantId }).exec()),
      map((banks) => this.mapper.mapFromList(banks)),
    );
  }

  updateOne(bank: Bank): Observable<void> {
    return of(bank).pipe(
      delayWhen((bank) =>
        this.industryRepository.upsert([
          ...bank.constraints.allowedIndustries,
          ...(bank.constraints.deposits?.byIndustries.map((rule) => rule.industry) ?? []),
        ]),
      ),
      map((bank) => this.mapper.reverseMap(bank)),
      mergeMap((bankDocument) => {
        const { _id, version, ...update } = bankDocument;
        return this.model.findOneAndUpdate({ _id, version, tenant_id: this.userContext.store.tenantId }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, Bank not found for [Id:${bank.id.toString()}], and [version:${bank.version}]`;
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
}
