import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '../errors';

export class GetTenantConfigQuery {
  protected constructor(public readonly tenant: string) {}

  static create(tenant: OptionalValue<string>): Result<GetTenantConfigQuery> {
    return Validator.of(tenant)
      .required(() => DomainErrorCode.TENANT_ID_EMPTY)
      .string(() => DomainErrorCode.TENANT_ID_INVALID)
      .map((tenant) => new GetTenantConfigQuery(tenant));
  }
}
