import { Validator } from '@internal/common';
import { AuthContextStore } from '@internal/http';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';

import { HEADER_TENANT_ID, TenantConfig } from '@/app/common';
import { DomainErrorCode } from '@/domain/common';

import { ExtendedAuthContextStorage } from '../context-storages';

@Injectable()
export class CreateWebhookContextMiddleware implements NestMiddleware {
  constructor(
    private readonly context: ExtendedAuthContextStorage,
    private readonly tenantConfig: TenantConfig,
  ) {}

  use(req: Request & { userId: string }, _: Response, next: NextFunction) {
    const tenantResult = Validator.of(decodeURIComponent(req.query[HEADER_TENANT_ID] as string))
      .required(() => DomainErrorCode.TENANT_ID_EMPTY)
      .string(() => DomainErrorCode.TENANT_ID_INVALID)
      .validate(
        (tenant) => this.tenantConfig.tenants.map((tenant) => tenant.id).includes(tenant),
        () => DomainErrorCode.TENANT_ID_INVALID,
      );

    if (tenantResult.isFailure()) throw new UnauthorizedError(tenantResult.error.message);

    this.context.run(
      { tenantId: tenantResult.getOrThrow() } as AuthContextStore & {
        tenantId: string;
      },
      () => next(),
    );
  }
}
