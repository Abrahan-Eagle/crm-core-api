import { mapToVoid, Nullable } from '@internal/common';
import { Injectable } from '@nestjs/common';
import api from 'notificationapi-node-server-sdk';
import { mergeMap, Observable, of } from 'rxjs';

import { NotificationAPIConfig } from '@/app/common';
import { Id } from '@/domain/common';
import { NotificationRepository } from '@/domain/notification';

@Injectable()
export class NotificationAPIRepository implements NotificationRepository {
  private notification = api;

  constructor(private readonly config: NotificationAPIConfig) {
    this.notification.init(this.config.clientId, this.config.clientSecret);
  }

  notifyUser(userId: Id, description: string, redirectUrl: Nullable<string>): Observable<void> {
    return of(userId).pipe(
      mergeMap((id) =>
        this.notification.send({
          notificationId: this.config.channelId,
          user: {
            id: id.toString(),
          },
          mergeTags: {
            redirect_url: `${this.config.baseAppUrl}${redirectUrl}`,
            description: description,
          },
        }),
      ),
      mapToVoid(),
    );
  }
}
