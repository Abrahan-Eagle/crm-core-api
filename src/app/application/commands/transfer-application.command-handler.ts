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
import { delayWhen, forkJoin, map, mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Application, ApplicationRepository, TransferApplicationCommand } from '@/domain/application';
import { Id } from '@/domain/common';
import { User, UserRepository } from '@/domain/user';

@CommandHandler(TransferApplicationCommand)
export class TransferApplicationCommandHandler extends BaseCommandHandler<TransferApplicationCommand, void> {
  constructor(
    @Inject(InjectionConstant.APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: TransferApplicationCommand): Observable<void> {
    const { applicationId, userId } = command;
    return forkJoin({
      user: this._getUser(userId),
      app: this.applicationRepository.findById(applicationId),
    }).pipe(
      map(({ app }) => app),
      throwIfVoid(() => NotFound.of(Application, applicationId)),
      mergeMap((application) =>
        this.applicationRepository.getAppsByCompanyId(application.period, application.companyId),
      ),
      tap((apps: Application[]) => Result.combine(apps.map((app) => app.transfer(userId))).getOrThrow()),
      delayWhen((apps: Application[]) =>
        this.transactionService.runInTransaction(() => this.applicationRepository.updateMany(apps)),
      ),
      mapToVoid(),
    );
  }

  private _getUser(userId: Id): Observable<User> {
    return this.userRepository.findById(userId).pipe(
      throwIfVoid<User>(() => NotFound.of(User, userId.toString())),
      validateIf(
        (user) => user.isActive(),
        () => NotFound.of(User, userId.toString()),
      ),
    );
  }
}
