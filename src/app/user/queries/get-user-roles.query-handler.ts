import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { GetUserRolesQuery, IdentityProviderRepository } from '@/domain/user';

import { RoleResponse } from '../dtos';

@QueryHandler(GetUserRolesQuery)
export class GetUserRolesQueryHandler extends BaseQueryHandler<GetUserRolesQuery, RoleResponse[]> {
  constructor(
    @Inject(InjectionConstant.IDENTITY_PROVIDER_REPOSITORY)
    private readonly identityProvider: IdentityProviderRepository,
  ) {
    super();
  }

  handle(): Observable<RoleResponse[]> {
    return this.identityProvider
      .getRoles()
      .pipe(map((roles) => plainToInstance(RoleResponse, roles, { excludeExtraneousValues: true })));
  }
}
