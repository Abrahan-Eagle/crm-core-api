import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { LeadGroup, Prospect } from '../entities';

export interface LeadsRepository {
  createLeadGroup(group: LeadGroup): Observable<void>;
  saveProspects(prospects: Prospect[]): Observable<void>;
  getProspectByLeadId(leadId: Id, prospectId: Id): Observable<Nullable<Prospect>>;
  getProspectById(leadId: Id): Observable<Nullable<Prospect>>;
  updateProspect(prospect: Prospect): Observable<void>;
  findById(id: Id): Observable<Nullable<LeadGroup>>;
  updateLead(group: LeadGroup): Observable<void>;
}
