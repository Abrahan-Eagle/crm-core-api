import { BaseQueryHandler, NotFound, QueryHandler, throwIfVoid } from '@internal/common';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { from, map, Observable, zip } from 'rxjs';

import { InjectionConstant, TenantConfigResponse } from '@/app/common';
import { GetTenantConfigQuery } from '@/domain/common';
import { IdentityProviderRepository } from '@/domain/user';
import { TenantConfigDocument } from '@/infra/adapters';

@QueryHandler(GetTenantConfigQuery)
export class GetTenantConfigQueryHandler extends BaseQueryHandler<GetTenantConfigQuery, TenantConfigResponse> {
  constructor(
    @Inject(InjectionConstant.IDENTITY_PROVIDER_REPOSITORY)
    private readonly identityProvider: IdentityProviderRepository,
    @InjectModel(InjectionConstant.TENANT_CONFIG_MODEL)
    private readonly model: Model<TenantConfigDocument>,
  ) {
    super();
  }

  handle(query: GetTenantConfigQuery): Observable<TenantConfigResponse> {
    const { tenant } = query;
    return zip(
      this.identityProvider.getSystemAccessToken(),
      from(this.model.find({ name: tenant }).exec()).pipe(
        map(([config]) => config),
        throwIfVoid(() => NotFound.of('Provider', tenant)),
      ),
    ).pipe(
      map(([access_token, tenant]) => {
        return plainToInstance(
          TenantConfigResponse,
          { ...tenant.toJSON(), access_token },
          { excludeExtraneousValues: true },
        );
      }),
    );
  }
}
