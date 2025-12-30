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
import { Application, ApplicationRepository, CreateOfferCommand } from '@/domain/application';
import { ApplicationBlocked, Id, NotificationRequestedEvent } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';

@CommandHandler(CreateOfferCommand)
export class CreateOfferCommandHandler extends BaseCommandHandler<CreateOfferCommand, void> {
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

  handle(command: CreateOfferCommand): Observable<void> {
    return this._getApplication(command.applicationId).pipe(
      tap((application: Application) => application.addOffer(command.notificationId, command.offer).getOrThrow()),
      delayWhen((application) => this.repository.updateOne(application)),
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
              `Your app has a new offer!: ${company.companyName}`,
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
