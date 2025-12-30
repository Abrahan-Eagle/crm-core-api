import { BaseEventHandler, EventHandler } from '@internal/common';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ExternalContactsConfig, InjectionConstant } from '@/app/common';
import { DraftApplicationCreatedEvent } from '@/domain/application';
import { ExternalContactsRepository } from '@/domain/contact';

@EventHandler(DraftApplicationCreatedEvent)
export class DraftApplicationCreatedEventHandler extends BaseEventHandler<DraftApplicationCreatedEvent> {
  constructor(
    @Inject(InjectionConstant.EXTERNAL_CONTACTS_REPOSITORY)
    private readonly repository: ExternalContactsRepository,
    private readonly config: ExternalContactsConfig,
  ) {
    super();
  }

  handle(event: DraftApplicationCreatedEvent): Observable<void> {
    return this.repository.removeTag(
      event.prospectId,
      this.config.secret[event.audience].abandoned_tag,
      event.audience,
    );
  }
}
