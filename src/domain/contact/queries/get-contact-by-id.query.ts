import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetContactByIdQuery {
  private constructor(
    public readonly id: Id,
    public readonly onlyMine: boolean,
  ) {}

  static create(id: OptionalValue<string>, onlyMine: boolean): Result<GetContactByIdQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.CONTACT_ID_EMPTY,
      () => DomainErrorCode.CONTACT_ID_INVALID,
    ).map((id) => new GetContactByIdQuery(id, onlyMine));
  }
}
