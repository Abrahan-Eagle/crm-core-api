import { Email, Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { Bank } from '../entities';

export interface BankRepository {
  createOne(Bank: Bank): Observable<void>;
  findById(id: Id): Observable<Nullable<Bank>>;
  findByContactEmail(email: Email): Observable<Nullable<Bank>>;
  findManyById(id: Id[]): Observable<Bank[]>;
  updateOne(bank: Bank): Observable<void>;
}
