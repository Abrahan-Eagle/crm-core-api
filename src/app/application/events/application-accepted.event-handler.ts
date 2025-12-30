import { BaseEventHandler, EventHandler, mapToVoid } from '@internal/common';
import { Inject, Logger } from '@nestjs/common';
import { delayWhen, map, Observable, of, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { ApplicationAcceptedEvent } from '@/domain/application';
import { Commission, CommissionRepository } from '@/domain/commission';

@EventHandler(ApplicationAcceptedEvent)
export class ApplicationAcceptedEventHandler extends BaseEventHandler<ApplicationAcceptedEvent> {
  private readonly logger = new Logger(ApplicationAcceptedEventHandler.name);

  constructor(
    @Inject(InjectionConstant.COMMISSION_REPOSITORY)
    private readonly repository: CommissionRepository,
  ) {
    super();
  }

  handle(event: ApplicationAcceptedEvent): Observable<void> {
    return of(event).pipe(
      map(({ applicationId, companyId, bankId, commission }) =>
        Commission.create(applicationId, companyId, bankId, commission).getOrThrow(),
      ),
      delayWhen((commission) => this.repository.createOne(commission)),
      tap<Commission>((commission) =>
        this.logger.log(`New commission generated ${commission.applicationId.toString()}`),
      ),
      mapToVoid(),
    );
  }
}
