import { BaseEventHandler, EventHandler } from '@internal/common';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { ProspectCreatedEvent } from '@/domain/application';
import { MailerService } from '@/domain/common';

@EventHandler(ProspectCreatedEvent)
export class ProspectCreatedEventHandler extends BaseEventHandler<ProspectCreatedEvent> {
  constructor(
    @Inject(InjectionConstant.MAILER_SERVICE)
    private readonly mailer: MailerService,
  ) {
    super();
  }

  handle(event: ProspectCreatedEvent): Observable<void> {
    return this.mailer.send({
      from: 'deals@businessmarketfinders.com',
      subject: 'New prospect apply',
      to: 'richard@richardtaty.com',
      message: `First name: ${event.firstName}\nLast name: ${event.lastName}\nLooking for: $${
        event.lookingFor
      }\nPhone: ${event.phone}\nEmail: ${event.email}\nSource: ${event.source || 'not set'}\nReference: ${
        event.reference || 'not set'
      }`,
      attachments: [],
    });
  }
}
