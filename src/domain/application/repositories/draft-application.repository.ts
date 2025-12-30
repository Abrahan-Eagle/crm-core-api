import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { DraftApplication } from '../entities';

export interface DraftApplicationRepository {
  saveOne(draft: DraftApplication): Observable<void>;
  findById(id: Id): Observable<Nullable<DraftApplication>>;
  deleteById(id: Id): Observable<void>;
  updateOne(application: DraftApplication): Observable<void>;
  getActiveByPeriod(period: string, companyId: Id): Observable<Nullable<DraftApplication>>;
}
