import { Id, mapToVoid, Nullable, OptimisticLockingException, throwIfVoid } from '@internal/common';
import { MONGO_ERRORS, MongoTransactionContextStorage } from '@internal/mongo';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, delayWhen, map, mergeMap, Observable, of, throwError } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { CompanyDuplicated, FileDuplicated, IndustryRepository } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';

import { CompanyDocument } from '../documents';
import { CompanyMapper } from '../mappers';

@Injectable()
export class MongoCompanyRepository implements CompanyRepository {
  constructor(
    @InjectModel(InjectionConstant.COMPANY_MODEL)
    private readonly model: Model<CompanyDocument>,
    private readonly mapper: CompanyMapper,
    private readonly context: MongoTransactionContextStorage,
    @Inject(InjectionConstant.INDUSTRY_REPOSITORY)
    private readonly industryRepository: IndustryRepository,
  ) {}

  createOne(company: Company): Observable<void> {
    return of(company).pipe(
      delayWhen((company) => this.industryRepository.upsert([company.industry])),
      map((company) => this.mapper.reverseMap(company)),
      mergeMap((companyDocument) =>
        this.model.create([companyDocument], { session: this.context.getStore()?.session }),
      ),
      mapToVoid(),
      catchError((error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) {
          return throwError(() => new CompanyDuplicated());
        }
        return throwError(() => error);
      }),
    );
  }

  findById(id: Id): Observable<Nullable<Company>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.findOne({ _id })),
      map((company) => company && this.mapper.map(company)),
    );
  }

  findMany(ids: Id[]): Observable<Company[]> {
    return of(ids).pipe(
      map((ids) => ids.map((id) => new Types.ObjectId(id.toString()))),
      mergeMap((_ids) => this.model.find({ _id: { $in: _ids } }).exec()),
      map((companies) => this.mapper.mapFromList(companies)),
    );
  }

  updateOne(company: Company): Observable<void> {
    return of(company).pipe(
      delayWhen((company) => this.industryRepository.upsert([company.industry])),
      map((company) => this.mapper.reverseMap(company)),
      mergeMap((companyMongoDocument) => {
        const { _id, version, ...update } = companyMongoDocument;
        return this.model.findOneAndUpdate({ _id, version }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, Company not found for [Id:${company.id.toString()}], and [version:${
          company.version
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
}
