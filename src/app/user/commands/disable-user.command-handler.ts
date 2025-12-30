import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, forkJoin, mergeMap, Observable, of, tap, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { DisableUserCommand, IdentityProviderRepository, User, UserRepository } from '@/domain/user';

@CommandHandler(DisableUserCommand)
export class DisableUserCommandHandler extends BaseCommandHandler<DisableUserCommand, void> {
  constructor(
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly repository: UserRepository,
    @Inject(InjectionConstant.IDENTITY_PROVIDER_REPOSITORY)
    private readonly identityProviderRepository: IdentityProviderRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: DisableUserCommand): Observable<void> {
    return this.repository.findById(command.id).pipe(
      throwIfVoid(() => NotFound.of(User, command.id.toString())),
      tap((user: User) => user.disable().getOrThrow()),
      mergeMap((user: User) =>
        forkJoin({
          user: of(user),
          identityUserId: this.identityProviderRepository
            .getUserIdByEmail(user.email)
            .pipe(throwIfVoid(() => NotFound.of(User, user.email.toString()))),
        }),
      ),
      delayWhen(({ user, identityUserId }) =>
        this.transactionService.runInTransaction(() =>
          zip([this.repository.updateOne(user), this.identityProviderRepository.disableUser(identityUserId)]),
        ),
      ),
      mapToVoid(),
    );
  }
}
