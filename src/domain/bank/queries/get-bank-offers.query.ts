import { OptionalValue, Result } from '@internal/common';
import { PaginationQuery } from '@internal/http';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetBankOffersQuery {
  private constructor(
    public readonly pagination: PaginationQuery,
    public readonly bankId: Id,
  ) {}

  static create(pagination: PaginationQuery, bankId: OptionalValue<string>): Result<GetBankOffersQuery> {
    return Id.create(
      bankId,
      () => DomainErrorCode.BANK_ID_EMPTY,
      () => DomainErrorCode.BANK_ID_EMPTY,
    ).map((id) => new GetBankOffersQuery(pagination, id));
  }
}
