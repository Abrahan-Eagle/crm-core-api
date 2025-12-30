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
import { bufferCount, forkJoin, from, mergeMap, Observable, of, tap, toArray } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant, MediaConfig, TenantConfig } from '@/app/common';
import {
  Application,
  ApplicationRepository,
  BankNotification,
  NOTIFICATION_STATUS,
  SendPendingNotificationsCommand,
} from '@/domain/application';
import { Bank, BankRepository } from '@/domain/bank';
import {
  ApplicationBlocked,
  EmailRequest,
  Id,
  InvalidTenantId,
  MailerService,
  UrlSignerService,
} from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';
import { ExtendedAuthContextStorage } from '@/infra/common';

@CommandHandler(SendPendingNotificationsCommand)
export class SendPendingNotificationsCommandHandler extends BaseCommandHandler<SendPendingNotificationsCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(InjectionConstant.MAILER_SERVICE)
    private readonly mailer: MailerService,
    private readonly mediaConfig: MediaConfig,
    private readonly tenantConfig: TenantConfig,
    private readonly context: ExtendedAuthContextStorage,
    @Inject(InjectionConstant.URL_SIGNER_SERVICE)
    private readonly signer: UrlSignerService,
  ) {
    super();
  }

  handle(command: SendPendingNotificationsCommand): Observable<void> {
    const { applicationId, message } = command;

    return this._getApplication(applicationId).pipe(
      mergeMap((application) => {
        const notifications = application.notifications.filter(
          (notification) => notification.status === NOTIFICATION_STATUS.PENDING,
        );

        return forkJoin({
          application: of(application),
          notifications: of(notifications),
          banks: this.bankRepository.findManyById(notifications.map((notification) => notification.bankId)),
        });
      }),

      tap<{
        application: Application;
        notifications: BankNotification[];
        banks: Bank[];
      }>(({ application, notifications }) =>
        Result.combine(
          notifications.map((notification) =>
            application.updateNotificationStatus(notification.id, NOTIFICATION_STATUS.SENT),
          ),
        ).getOrThrow(),
      ),
      mergeMap(({ application, banks, notifications }) =>
        forkJoin({
          application: of(application),
          banks: of(banks),
          notifications: of(notifications),
          company: this._getCompany(application.companyId),
        }),
      ),
      mergeMap(({ application, banks, notifications, company }) =>
        forkJoin({
          application: of(application),
          banks: of(banks),
          notifications: of(notifications),
          company: of(company),
        }),
      ),
      mergeMap(({ application, banks, company }) =>
        this.transactionService.runInTransaction(() =>
          this.applicationRepository.updateOne(application).pipe(
            mergeMap(() =>
              from(
                banks
                  .map((bank) =>
                    bank.contacts.map((contact) => contact.emails.map((email) => email.value).flat()).flat(),
                  )
                  .flat(),
              ).pipe(
                bufferCount(50),
                mergeMap((emails) => this.mailer.send(this._buildEmail(emails, message, application, company))),
                toArray(),
              ),
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

  private _getCompany(id: Id): Observable<Company> {
    return this.companyRepository.findById(id).pipe(throwIfVoid(() => NotFound.of(Company, id)));
  }

  private _buildEmail(emails: string[], message: string, application: Application, company: Company): EmailRequest {
    /**
       The attachments to be added are:
       - Filled Applications
        - Account statements
        - All additional account statements
    **/
    const attachments: string[] = [];

    const { uri: appURI } = this.mediaConfig.getMediaConfig(ENTITY_MEDIA_TYPE.APPLICATION);
    application.allDocs.forEach((document) => attachments.push(this.signer.sign(`${appURI}/${document.name}`)));

    const tenant = this.tenantConfig.tenants.find((tenant) => tenant.id === this.context.store.tenantId);
    if (!tenant || !tenant.email) {
      throw new InvalidTenantId(this.context.store.tenantId);
    }

    return {
      from: tenant.email,
      attachments: attachments,
      subject: `#${application.trackingId}# Funding Requested - ${company.companyName}`,
      bcc: emails,
      message,
    };
  }
}
