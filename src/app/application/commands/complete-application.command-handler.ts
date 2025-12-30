import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, mergeMap, Observable, of, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import {
  Application,
  APPLICATION_STATUS,
  ApplicationRepository,
  CompleteApplicationCommand,
} from '@/domain/application';
import { ApplicationNotApproved, Id } from '@/domain/common';

@CommandHandler(CompleteApplicationCommand)
export class CompleteApplicationCommandHandler extends BaseCommandHandler<CompleteApplicationCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
  ) {
    super();
  }

  handle(command: CompleteApplicationCommand): Observable<void> {
    return of(command).pipe(
      mergeMap((command) => this._getApplication(command.applicationId)),
      tap((application: Application) => application.markAsCompleted().getOrThrow()),
      delayWhen((application: Application) => this.applicationRepository.updateOne(application)),
      mapToVoid(),
    );
  }

  private _getApplication(id: Id): Observable<Application> {
    return this.applicationRepository.findById(id).pipe(
      throwIfVoid(() => NotFound.of(Application, id)),
      validateIf(
        (application) => application.status === APPLICATION_STATUS.OFFER_ACCEPTED,
        (application) => new ApplicationNotApproved(application.status),
      ),
    );
  }
}
