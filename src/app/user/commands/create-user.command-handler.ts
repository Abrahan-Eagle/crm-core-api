import { BadRequest, BaseCommandHandler, CommandHandler, mapToVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, map, Observable, of, zip } from 'rxjs';

import { InjectionConstant, TenantConfig } from '@/app/common';
import { DomainErrorCode, Id } from '@/domain/common';
import { CreateUserCommand, IdentityProviderRepository, UserRepository } from '@/domain/user';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler extends BaseCommandHandler<CreateUserCommand, Id> {
  constructor(
    @Inject(InjectionConstant.USER_REPOSITORY)
    private readonly repository: UserRepository,
    @Inject(InjectionConstant.IDENTITY_PROVIDER_REPOSITORY)
    private readonly identityProviderRepository: IdentityProviderRepository,
    private readonly tenantConfig: TenantConfig,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: CreateUserCommand): Observable<Id> {
    return of(command).pipe(
      delayWhen(({ user }) => zip([this.validateRoles(user.roles), this.validateTenants(user.tenants)])),
      delayWhen(({ user, password }) =>
        this.transactionService.runInTransaction(() =>
          zip([
            this.repository.createOne(user),
            this.identityProviderRepository.createUser(user, password, user.roles, user.tenants),
          ]),
        ),
      ),
      map(({ user }) => user.id),
    );
  }

  private validateRoles(userRoles: string[]): Observable<void> {
    return this.identityProviderRepository.getRoles().pipe(
      map((roles) => roles.map((role) => role.id)),
      validateIf(
        (roles) => userRoles.every((role) => roles.includes(role)),
        () => new BadRequest(DomainErrorCode.USER_ROLE_INVALID),
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
