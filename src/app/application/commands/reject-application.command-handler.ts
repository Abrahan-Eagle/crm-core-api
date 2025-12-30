import {
  BaseCommandHandler,
  CommandHandler,
  CommonConstant,
  EventDispatcher,
  mapToVoid,
  NotFound,
  Nullable,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { Inject } from '@nestjs/common';
import { delayWhen, forkJoin, mergeMap, Observable, of, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, APPLICATION_STATUS, ApplicationRepository, RejectApplicationCommand } from '@/domain/application';
import { ApplicationBlocked, Id, NotificationRequestedEvent } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';

@CommandHandler(RejectApplicationCommand)
export class RejectApplicationCommandHandler extends BaseCommandHandler<RejectApplicationCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(CommonConstant.EVENT_DISPATCHER)
    private readonly dispatcher: EventDispatcher,
  ) {
    super();
  }

  handle(command: RejectApplicationCommand): Observable<void> {
    return of(command).pipe(
      mergeMap((command) => this._getApplication(command.applicationId)),
      tap((application: Application) => application.reject(command.reason, command.other).getOrThrow()),
      delayWhen((application) => this.applicationRepository.updateOne(application)),
      mergeMap((app) =>
        forkJoin({
          application: of(app),
          company: this.companyRepository.findById(app.companyId),
        }),
      ),
      tap<{
        application: Application;
        company: Nullable<Company>;
      }>(
        ({ application, company }) =>
          application &&
          company &&
          this.dispatcher.dispatchEventsAsync([
            new NotificationRequestedEvent(
              application.createdBy!.toString(),
              `Your application has been rejected: ${company.companyName}`,
              `/applications/${application.id.toString()}`,
            ),
          ]),
      ),
      mapToVoid(),
    );
  }

  private _getApplication(id: Id): Observable<Application> {
    return this.applicationRepository.findById(id).pipe(
      throwIfVoid(() => NotFound.of(Application, id)),
      validateIf(
        (application) => ![APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.COMPLETED].includes(application.status),
        (application) => new ApplicationBlocked(application.status),
      ),
    );
  }
}
