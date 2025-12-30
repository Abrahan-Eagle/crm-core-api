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
import { AcceptOfferCommand, Application, ApplicationRepository } from '@/domain/application';
import { ApplicationBlocked, Id, NotificationRequestedEvent } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';

@CommandHandler(AcceptOfferCommand)
export class AcceptOfferCommandHandler extends BaseCommandHandler<AcceptOfferCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly repository: ApplicationRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(CommonConstant.EVENT_DISPATCHER)
    private readonly dispatcher: EventDispatcher,
  ) {
    super();
  }

  handle(command: AcceptOfferCommand): Observable<void> {
    return this._getApplication(command.applicationId).pipe(
      tap((application: Application) => application.acceptOffer(command.notificationId, command.offerId).getOrThrow()),
      delayWhen<Application>((application) => this.repository.updateOne(application)),
      mergeMap((application: Application) =>
        forkJoin({
          application: of(application),
          company: this.companyRepository.findById(application.companyId),
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
              `An offer has been accepted on your application: ${company.companyName}`,
              `/applications/${application.id.toString()}`,
            ),
          ]),
      ),
      mapToVoid(),
    );
  }

  private _getApplication(id: Id): Observable<Application> {
    return this.repository.findById(id).pipe(
      throwIfVoid(() => NotFound.of(Application, id)),
      validateIf(
        (application) => !application.isBlocked,
        (application) => new ApplicationBlocked(application.status),
      ),
    );
  }
}
