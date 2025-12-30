import {
  BadRequest,
  BaseCommandHandler,
  CommandHandler,
  mapToVoid,
  NotFound,
  throwIfVoid,
  validateIf,
} from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, forkJoin, map, mergeMap, Observable, of, tap, zip } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { DomainErrorCode } from '@/domain/common';
import { AddRoleToUserCommand, IdentityProviderRepository, User, UserRepository } from '@/domain/user';

@CommandHandler(AddRoleToUserCommand)
export class AddRoleToUserCommandHandler extends BaseCommandHandler<AddRoleToUserCommand, void> {
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

  handle(command: AddRoleToUserCommand): Observable<void> {
    return zip([
      this.repository.findById(command.id).pipe(throwIfVoid(() => NotFound.of(User, command.id.toString()))),
      this.validateRole(command.role),
    ]).pipe(
      map(([user]) => user),
      tap((user) => user.addRole(command.role).getOrThrow()),
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
          zip([this.repository.updateOne(user), this.identityProviderRepository.addRole(identityUserId, command.role)]),
        ),
      ),
      mapToVoid(),
    );
  }

  private validateRole(role: string): Observable<void> {
    return this.identityProviderRepository.getRoles().pipe(
      map((roles) => roles.map((role) => role.id)),
      validateIf(
        (roles) => roles.includes(role),
        () => new BadRequest(DomainErrorCode.USER_ROLE_INVALID),
      ),
      mapToVoid(),
    );
  }
}
