import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetRecommendedBanksQuery {
  private constructor(public readonly id: Id) {}

  static create(id: OptionalValue<string>): Result<GetRecommendedBanksQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    ).map((id) => new GetRecommendedBanksQuery(id));
  }
}
