import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetBankByIdQuery {
  private constructor(public readonly id: Id) {}

  static create(id: OptionalValue<string>): Result<GetBankByIdQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.BANK_ID_EMPTY,
      () => DomainErrorCode.BANK_ID_INVALID,
    ).map((id) => new GetBankByIdQuery(id));
  }
}
