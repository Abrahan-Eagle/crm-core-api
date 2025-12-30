import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetLastApplicationPeriodQuery {
  private constructor(public readonly companyId: Id) {}

  static create(companyId: OptionalValue<string>): Result<GetLastApplicationPeriodQuery> {
    return Id.create(
      companyId,
      () => DomainErrorCode.COMPANY_ID_EMPTY,
      () => DomainErrorCode.COMPANY_ID_INVALID,
    ).map((id) => new GetLastApplicationPeriodQuery(id));
  }
}
