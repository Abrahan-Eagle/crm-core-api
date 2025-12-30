import { Email, Nullable, Phone } from '@internal/common';
import { Observable } from 'rxjs';

import { ApplicationReferral } from '@/domain/application';

export type Prospect = {
  first_name: string;
  last_name: string;
  email: string;
  phone: Phone;
  lang: string;
  looking_for?: number;
  referral: Nullable<ApplicationReferral>;
  tag_ids?: number[];
};

export interface ExternalContactsRepository {
  optInProspect(prospect: Prospect, audience: string): Observable<number>;
  getProspectId(email: Email, audience: string): Observable<Nullable<number>>;
  addTag(prospectId: number, tagId: number, audience: string): Observable<void>;
  removeTag(prospectId: number, tagId: number, audience: string): Observable<void>;
}
