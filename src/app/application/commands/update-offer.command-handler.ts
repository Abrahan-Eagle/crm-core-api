import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, APPLICATION_STATUS, ApplicationRepository, UpdateOfferCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';

@CommandHandler(UpdateOfferCommand)
export class UpdateOfferCommandHandler extends BaseCommandHandler<UpdateOfferCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly repository: ApplicationRepository,
  ) {
    super();
  }

  handle(command: UpdateOfferCommand): Observable<void> {
    const { applicationId, notificationId, offerId, ...update } = command;
    return this.repository.findById(applicationId).pipe(
      throwIfVoid(() => NotFound.of(Application, applicationId.toString())),
      validateIf(
        (application) => ![APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.COMPLETED].includes(application.status),
        (application) => new ApplicationBlocked(application.status),
      ),
      tap((application: Application) => application.updateOffer(notificationId, offerId, update).getOrThrow()),
      mergeMap((application) => this.repository.updateOne(application)),
      mapToVoid(),
    );
  }
}
