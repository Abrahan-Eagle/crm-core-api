import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { Commission } from '../entities';

export interface CommissionRepository {
  createOne(commission: Commission): Observable<void>;
  findById(id: Id): Observable<Nullable<Commission>>;
  updateOne(commission: Commission): Observable<void>;
}
