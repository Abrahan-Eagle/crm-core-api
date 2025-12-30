import { Optional, Validator } from '@internal/common';
import { AuthContextStore } from '@internal/http';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';

import { HEADER_TENANT_ID, TenantConfig } from '@/app/common';
import { DomainErrorCode, Id } from '@/domain/common';

import { ExtendedAuthContextStorage } from '../context-storages';

const namespace = 'https://businessmarketfinders.com/';
type ClaimKey = 'user_id';

const getClaimKey = (key: ClaimKey) => namespace + key;

@Injectable()
export class CreateAuthContextMiddleware implements NestMiddleware {
  constructor(
    private readonly context: ExtendedAuthContextStorage,
    private readonly tenantConfig: TenantConfig,
  ) {}

  use(req: Request & { userId: string }, _: Response, next: NextFunction) {
    const payload = Optional.ofUndefinable(req).getFromObject('auth').getFromObject('payload');

    const error = new UnauthorizedError();
    const userId = <string>payload.getFromObject(getClaimKey('user_id')).orElseThrow(error);

    const userIdResult = Id.create(
      userId,
      () => DomainErrorCode.USER_ID_EMPTY,
      () => DomainErrorCode.USER_ID_INVALID,
    );

    const userTenants = <string[]>payload.getFromObject('tenants').orElseGet(() => [] as string[]);

    const tenantResult = Validator.of(req.headers[HEADER_TENANT_ID] || 'business_market_finders')
      .required(() => DomainErrorCode.TENANT_ID_EMPTY)
      .string(() => DomainErrorCode.TENANT_ID_INVALID)
      .validate(
        (tenant) => userTenants.includes(tenant),
        () => DomainErrorCode.TENANT_ID_INVALID,
      )
      .validate(
        (tenant) => this.tenantConfig.tenants.map((tenant) => tenant.id).includes(tenant),
        () => DomainErrorCode.TENANT_ID_INVALID,
      );

    if (tenantResult.isFailure()) throw new UnauthorizedError(tenantResult.error.message);

    if (userIdResult.isFailure()) throw new UnauthorizedError(userIdResult.error.message);

    this.context.run(
      {
        userId: userIdResult.getOrThrow().toString(),
        tenantId: tenantResult.getOrThrow(),
        permissions: <string[]>payload.getFromObject('permissions').orElseGet(() => [] as string[]),
      } as AuthContextStore & {
        tenantId: string;
        permissions: string[];
      },
      () => next(),
    );
  }
}
