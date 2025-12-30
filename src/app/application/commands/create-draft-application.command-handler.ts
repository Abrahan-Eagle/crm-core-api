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
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, iif, map, mergeMap, Observable, of, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import {
  CreateDraftApplicationCommand,
  DraftApplication,
  DraftApplicationCreatedEvent,
  DraftApplicationRepository,
} from '@/domain/application';
import { ApplicationDuplicated, Id } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';
import { StorageRepository } from '@/domain/media';
import { User, UserRepository } from '@/domain/user';

@CommandHandler(CreateDraftApplicationCommand)
export class CreateDraftApplicationCommandHandler extends BaseCommandHandler<CreateDraftApplicationCommand, Id> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.DRAFT_APPLICATION_REPOSITORY)
    private readonly applicationRepository: DraftApplicationRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(CommonConstant.EVENT_DISPATCHER)
    private readonly dispatcher: EventDispatcher,
  ) {
    super();
  }

  handle(command: CreateDraftApplicationCommand): Observable<Id> {
    return of(command).pipe(
      delayWhen(({ application }) => zip(this.checkIfCompanyExist(application), this.checkForDuplicates(application))),
      tap(({ application }) => application.addSignature(command.signature).getOrThrow()),
      delayWhen(({ application }) =>
        iif(
          () => command.referralId !== null,
          of(command.referralId || {}).pipe(
            mergeMap(() => this.userRepository.findByReferralId(command.referralId!)),
            tap<Nullable<User>>((user) => {
              if (user !== null) {
                application.transfer(user.id).getOrThrow();
              }
            }),
          ),
          of(command.referralId || {}),
        ),
      ),
      delayWhen(({ application }) =>
        this.transactionService.runInTransaction(() => {
          return zip(
            this.applicationRepository
              .saveOne(application)
              .pipe(
                mergeMap(() =>
                  zip(
                    ...application.allFiles.map((file) => this.storage.saveFile(file, ENTITY_MEDIA_TYPE.APPLICATION)),
                    this.storage.saveFile(command.signature, ENTITY_MEDIA_TYPE.APPLICATION),
                  ),
                ),
              ),
          );
        }),
      ),
      tap((command) =>
        this.dispatcher.dispatchEventsAsync([
          new DraftApplicationCreatedEvent(command.application.prospectId, command.audience),
        ]),
      ),
      map(() => command.application.id),
    );
  }

  checkIfCompanyExist(application: DraftApplication): Observable<void> {
    return this.companyRepository.findById(application.companyId).pipe(
      throwIfVoid(() => NotFound.of(Company, application.companyId.toString())),
      mapToVoid(),
    );
  }

  checkForDuplicates(application: DraftApplication): Observable<void> {
    return this.applicationRepository.getActiveByPeriod(application.period, application.companyId).pipe(
      validateIf(
        (app) => !app,
        () => new ApplicationDuplicated(),
      ),
      mapToVoid(),
    );
  }
}
