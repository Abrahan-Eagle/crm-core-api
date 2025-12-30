import { Observable } from 'rxjs';

import { Industry } from '@/domain/common';

export interface IndustryRepository {
  upsert(industries: Industry[]): Observable<void>;
}
