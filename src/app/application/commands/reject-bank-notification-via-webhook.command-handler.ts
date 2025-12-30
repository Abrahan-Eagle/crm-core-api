import { BaseCommandHandler, CommandHandler, Email, NotFound, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { forkJoin, mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, ApplicationRepository, RejectBankNotificationViaWebhookCommand } from '@/domain/application';
import { Bank, BankRepository } from '@/domain/bank';
import { Id } from '@/domain/common';

@CommandHandler(RejectBankNotificationViaWebhookCommand)
export class RejectBankNotificationViaWebhookCommandHandler extends BaseCommandHandler<
  RejectBankNotificationViaWebhookCommand,
  void
> {
  constructor(
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
  ) {
    super();
  }

  handle(command: RejectBankNotificationViaWebhookCommand): Observable<void> {
    const { bankEmail, trackingId, reason, other } = command;

    return forkJoin({ bank: this._getBank(bankEmail), application: this._getApplication(trackingId) }).pipe(
      tap<{ bank: Bank; application: Application }>(({ application, bank }) =>
        application
          .rejectNotification(
            application.notifications.find((notification) => notification.bankId.equals(bank.id))?.id ?? Id.empty(),
            reason,
            other,
          )
          .getOrThrow(),
      ),
      mergeMap(({ application }) => this.applicationRepository.updateOne(application)),
    );
  }

  private _getBank(email: Email): Observable<Bank> {
    return this.bankRepository.findByContactEmail(email).pipe(throwIfVoid(() => NotFound.of(Bank, email.value)));
  }

  private _getApplication(trackingId: string): Observable<Application> {
    return this.applicationRepository
      .findByTrackingId(trackingId)
      .pipe(throwIfVoid(() => NotFound.of(Application, trackingId)));
  }
}
