import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetCompanyByIdQuery {
  private constructor(
    public readonly id: Id,
    public readonly onlyMine: boolean,
  ) {}

  static create(id: OptionalValue<string>, onlyMine: boolean): Result<GetCompanyByIdQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.COMPANY_ID_EMPTY,
      () => DomainErrorCode.COMPANY_ID_INVALID,
    ).map((id) => new GetCompanyByIdQuery(id, onlyMine));
  }
}
