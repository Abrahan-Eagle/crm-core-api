import {
  catchInstanceOf,
  mapToVoid,
  Nullable,
  ObjectId,
  OptimisticLockingException,
  throwIfVoid,
} from '@internal/common';
import { MONGO_ERRORS, MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of, throwError } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Id, UserDuplicated } from '@/domain/common';
import { User, UserRepository } from '@/domain/user';

import { UserDocument } from '../documents';
import { UserMapper } from '../mappers';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(InjectionConstant.USER_MODEL)
    private readonly model: Model<UserDocument>,
    private readonly mapper: UserMapper,
    private readonly context: MongoTransactionContextStorage,
  ) {}

  findByReferralId(referralId: string): Observable<Nullable<User>> {
    return of(referralId).pipe(
      mergeMap((referral_id) => this.model.findOne({ referral_id })),
      map((user) => user && this.mapper.map(user)),
    );
  }

  findById(id: Id): Observable<Nullable<User>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.model.findOne({ _id })),
      map((user) => user && this.mapper.map(user)),
    );
  }

  updateOne(user: User): Observable<void> {
    return of(user).pipe(
      map((user) => this.mapper.reverseMap(user)),
      mergeMap((userDoc) => {
        const { _id, version, ...update } = userDoc;
        return this.model.findOneAndUpdate({ _id, version }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, User not found for [Id:${user.id.toString()}], and [version:${user.version}]`;
        return new OptimisticLockingException(message);
      }),
      mapToVoid(),
    );
  }

  findMany(ids: ObjectId[]): Observable<User[]> {
    return of(ids).pipe(
      map((ids) => ids.map((id) => new Types.ObjectId(id.toString()))),
      mergeMap((_ids) => this.model.find({ _id: { $in: _ids } }).exec()),
      map((users) => this.mapper.mapFromList(users)),
    );
  }

  createOne(user: User): Observable<void> {
    return of(user).pipe(
      map((user) => this.mapper.reverseMap(user)),
      mergeMap((userDocument) =>
        this.model.create([userDocument], {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        }),
      ),
      mapToVoid(),
      catchInstanceOf(MongoServerError, (error) => {
        if (error.code === MONGO_ERRORS.DUPLICATED_KEY) return throwError(() => new UserDuplicated());
        return throwError(() => error);
      }),
    );
  }
}
