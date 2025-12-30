import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, map, mergeMap, Observable, of, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { Application, ApplicationRepository, CreateApplicationCommand } from '@/domain/application';
import { ApplicationDuplicated, getPeriodFromDate, getPreviousPeriods, Id } from '@/domain/common';
import { Company, CompanyRepository } from '@/domain/company';
import { StorageRepository } from '@/domain/media';

import { AppClonerService } from '../services';

@CommandHandler(CreateApplicationCommand)
export class CreateApplicationCommandHandler extends BaseCommandHandler<CreateApplicationCommand, Id> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    private readonly clonerService: AppClonerService,
  ) {
    super();
  }

  handle(command: CreateApplicationCommand): Observable<Id> {
    const {
      id,
      companyId,
      loanAmount,
      product,
      referral,
      bankStatements,
      mtdStatements,
      creditCardStatements,
      additionalStatements,
      createdBy,
    } = command;
    return of({}).pipe(
      delayWhen(() =>
        zip(this.checkIfCompanyExist(companyId), this.checkForDuplicates(companyId, getPeriodFromDate(new Date()))),
      ),
      mergeMap(() => this.applicationRepository.getLastApplication(companyId)),
      map((lastApplication) => {
        const requiredStatements = getPreviousPeriods(new Date(), 4);
        return Application.create(
          id,
          companyId,
          loanAmount,
          product,
          referral,
          [...bankStatements, ...(lastApplication?.bankStatements ?? [])].filter((statement) =>
            requiredStatements.includes(statement.period!),
          ),
          mtdStatements,
          creditCardStatements,
          additionalStatements,
          createdBy,
        ).getOrThrow();
      }),
      mergeMap((application) => this.clonerService.cloneForAllTenants(application)),
      delayWhen((apps) =>
        this.transactionService.runInTransaction(() => {
          const [main, ...others] = apps;
          return zip(
            this.applicationRepository
              .saveForTenants(apps)
              .pipe(
                mergeMap(() =>
                  zip(
                    ...main.application.allFiles.map((file) =>
                      this.storage.saveFile(file, ENTITY_MEDIA_TYPE.APPLICATION),
                    ),
                    ...others.map((cloned) =>
                      this.storage.saveFile(
                        cloned.application.filledApplications[0].file!,
                        ENTITY_MEDIA_TYPE.APPLICATION,
                      ),
                    ),
                  ),
                ),
              ),
          );
        }),
      ),
      map(() => command.id),
    );
  }

  checkIfCompanyExist(companyId: Id): Observable<void> {
    return this.companyRepository.findById(companyId).pipe(
      throwIfVoid(() => NotFound.of(Company, companyId.toString())),
      mapToVoid(),
    );
  }

  checkForDuplicates(companyId: Id, period: string): Observable<void> {
    return this.applicationRepository.getActiveByPeriod(period, companyId).pipe(
      validateIf(
        (app) => !app,
        () => new ApplicationDuplicated(),
      ),
      mapToVoid(),
    );
  }
}
