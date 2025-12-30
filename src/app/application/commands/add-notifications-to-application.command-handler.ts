import {
  BaseCommandHandler,
  CommandHandler,
  mapToVoid,
  NotFound,
  Result,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, forkJoin, mergeMap, Observable, of, tap } from 'rxjs';

import { HEADER_TENANT_ID, InjectionConstant, SchedulerServiceConfig } from '@/app/common';
import { AddNotificationsToApplicationCommand, Application, ApplicationRepository } from '@/domain/application';
import { Bank, BankRepository } from '@/domain/bank';
import { ApplicationBlocked, Id, SchedulerService } from '@/domain/common';
import { ExtendedAuthContextStorage } from '@/infra/common';

@CommandHandler(AddNotificationsToApplicationCommand)
export class AddNotificationsToApplicationCommandHandler extends BaseCommandHandler<
  AddNotificationsToApplicationCommand,
  void
> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(InjectionConstant.SCHEDULER_SERVICE)
    private readonly scheduler: SchedulerService,
    private readonly schedulerConfig: SchedulerServiceConfig,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(command: AddNotificationsToApplicationCommand): Observable<void> {
    const { bankNotifications, message } = command;

    return of(command).pipe(
      mergeMap(({ applicationId, bankNotifications }) =>
        forkJoin({
          application: this._getApplication(applicationId),
          validateBanks: this._validateBanks(bankNotifications.map((notification) => notification.bankId)),
        }),
      ),
      tap<{
        application: Application;
        validateBanks: void;
      }>(({ application }) =>
        Result.combine(bankNotifications.map((notification) => application.addNotification(notification))).getOrThrow(),
      ),
      delayWhen<{
        application: Application;
      }>(({ application }) =>
        this.transactionService.runInTransaction(() =>
          this.applicationRepository.updateOne(application).pipe(
            mergeMap(() =>
              this.scheduler.schedule({
                url: `${
                  this.schedulerConfig.config.currentServiceUrl
                }/v1/applications/${application.id.toString()}/send-to-banks?key=${
                  this.schedulerConfig.config.webhookAuthKey
                }&${HEADER_TENANT_ID}=${encodeURIComponent(this.context.store.tenantId)}`,
                method: 'PUT',
                priority: 'medium',
                name: `Send ${
                  bankNotifications.length
                } bank notifications for application ${application.id.toString()}`,
                data: {
                  message,
                },
              }),
            ),
          ),
        ),
      ),
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

  private _validateBanks(ids: Id[]): Observable<void> {
    return this.bankRepository.findManyById(ids).pipe(
      validateIf(
        (banks) => banks.length === ids.length,
        (banks) =>
          NotFound.of(
            Bank,
            ids.filter((id) => !banks.map((bank) => bank.id.toString()).includes(id.toString())).toString(),
          ),
      ),
      mapToVoid(),
    );
  }
}
