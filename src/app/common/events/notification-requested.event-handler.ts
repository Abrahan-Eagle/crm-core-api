import { BaseEventHandler, EventHandler } from '@internal/common';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Id, NotificationRequestedEvent } from '@/domain/common';
import { NotificationRepository } from '@/domain/notification';

@EventHandler(NotificationRequestedEvent)
export class NotificationRequestedEventHandler extends BaseEventHandler<NotificationRequestedEvent> {
  constructor(
    @Inject(InjectionConstant.NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
  ) {
    super();
  }

  handle(event: NotificationRequestedEvent): Observable<void> {
    return this.repository.notifyUser(Id.load(event.userId), event.description, event.redirectUrl ?? null);
  }
}
