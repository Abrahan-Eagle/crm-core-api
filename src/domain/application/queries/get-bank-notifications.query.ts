import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetBankNotificationsQuery {
  private constructor(public readonly id: Id) {}

  static create(id: OptionalValue<string>): Result<GetBankNotificationsQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    ).map((id) => new GetBankNotificationsQuery(id));
  }
}
