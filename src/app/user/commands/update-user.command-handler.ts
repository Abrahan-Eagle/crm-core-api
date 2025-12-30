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
import { delayWhen, forkJoin, mergeMap, Observable, of, tap, zip } from 'rxjs';

import { InjectionConstant, TenantConfig } from '@/app/common';
import { DomainErrorCode } from '@/domain/common';
import { IdentityProviderRepository, UpdateUserCommand, User, UserRepository } from '@/domain/user';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler extends BaseCommandHandler<UpdateUserCommand, void> {
  constructor(
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly repository: UserRepository,
    private readonly tenantConfig: TenantConfig,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(InjectionConstant.IDENTITY_PROVIDER_REPOSITORY)
    private readonly identityProviderRepository: IdentityProviderRepository,
  ) {
    super();
  }

  handle(command: UpdateUserCommand): Observable<void> {
    return this.repository.findById(command.userId).pipe(
      throwIfVoid(() => NotFound.of(User, command.userId.toString())),
      tap((user: User) => user.updateUser({ ...command })),
      delayWhen((user) => this.validateTenants(user.tenants)),
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
          zip([this.repository.updateOne(user), this.identityProviderRepository.updateTenants(identityUserId, user)]),
        ),
      ),
      mapToVoid(),
    );
  }

  private validateTenants(userTenants: string[]): Observable<void> {
    return of(this.tenantConfig.tenants.map((tenant) => tenant.id)).pipe(
      validateIf(
        (tenants) => userTenants.every((tenant) => tenants.includes(tenant)),
        () => new BadRequest(DomainErrorCode.USER_TENANTS_INVALID),
      ),
      mapToVoid(),
    );
  }
}
