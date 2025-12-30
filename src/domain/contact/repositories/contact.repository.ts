import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { Contact } from '../entities';

export interface ContactRepository {
  createOne(Contact: Contact): Observable<void>;
  findById(id: Id): Observable<Nullable<Contact>>;
  updateOne(contact: Contact): Observable<void>;
  findMany(ids: Id[]): Observable<Contact[]>;
}
