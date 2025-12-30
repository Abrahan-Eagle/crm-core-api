import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { User } from '../entities';

export interface UserRepository {
  createOne(user: User): Observable<void>;
  findMany(ids: Id[]): Observable<User[]>;
  findById(id: Id): Observable<Nullable<User>>;
  findByReferralId(referralId: string): Observable<Nullable<User>>;
  updateOne(user: User): Observable<void>;
}
