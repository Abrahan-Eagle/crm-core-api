import { Nullable, Phone } from '@internal/common';
import { Observable } from 'rxjs';

export interface VoIPProviderRepository {
  makeACall(phone: Phone, agentId: string): Observable<void>;
  getAgentIdFromEmail(email: string): Observable<Nullable<string>>;
}
