import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetCommissionByIdQuery {
  private constructor(public readonly id: Id) {}

  static create(id: OptionalValue<string>): Result<GetCommissionByIdQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.COMMISSION_ID_EMPTY,
      () => DomainErrorCode.COMMISSION_ID_INVALID,
    ).map((id) => new GetCommissionByIdQuery(id));
  }
}
