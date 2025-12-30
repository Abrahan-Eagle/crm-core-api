import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

export interface NotificationRepository {
  notifyUser(userId: Id, description: string, redirectUrl: Nullable<string>): Observable<void>;
}
