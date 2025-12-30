import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { Company } from '../entities';

export interface CompanyRepository {
  createOne(company: Company): Observable<void>;
  findById(id: Id): Observable<Nullable<Company>>;
  updateOne(company: Company): Observable<void>;
  findMany(ids: Id[]): Observable<Company[]>;
}
