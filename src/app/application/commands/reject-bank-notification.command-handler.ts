import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, of, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, ApplicationRepository, RejectBankNotificationCommand } from '@/domain/application';
import { ApplicationBlocked, Id } from '@/domain/common';

@CommandHandler(RejectBankNotificationCommand)
export class RejectBankNotificationCommandHandler extends BaseCommandHandler<RejectBankNotificationCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
  ) {
    super();
  }

  handle(command: RejectBankNotificationCommand): Observable<void> {
    return of(command).pipe(
      mergeMap((command) => this._getApplication(command.applicationId)),
      tap((application: Application) =>
        application.rejectNotification(command.notificationId, command.reason, command.other).getOrThrow(),
      ),
      mergeMap((application) => this.applicationRepository.updateOne(application)),
      mapToVoid(),
    );
  }

  private _getApplication(id: Id): Observable<Application> {
    return this.applicationRepository.findById(id).pipe(
      throwIfVoid(() => NotFound.of(Application, id)),
      validateIf(
        (application) => !application.isBlocked,
        (application) => new ApplicationBlocked(application.status),
      ),
    );
  }
}
