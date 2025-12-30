import { BaseCommandHandler, CommandHandler, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, ApplicationRepository, CancelOfferCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';

@CommandHandler(CancelOfferCommand)
export class CancelOfferCommandHandler extends BaseCommandHandler<CancelOfferCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly repository: ApplicationRepository,
  ) {
    super();
  }

  handle(command: CancelOfferCommand): Observable<void> {
    const { applicationId, notificationId, offerId } = command;
    return this.repository.findById(applicationId).pipe(
      throwIfVoid(() => NotFound.of(Application, applicationId)),
      validateIf(
        (application) => !application.isBlocked,
        (application) => new ApplicationBlocked(application.status),
      ),
      tap((application: Application) => application.cancelOffer(notificationId, offerId).getOrThrow()),
      mergeMap((application) => this.repository.updateOne(application)),
    );
  }
}
