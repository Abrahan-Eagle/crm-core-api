import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetApplicationByIdQuery {
  private constructor(
    public readonly id: Id,
    public readonly onlyMine: boolean,
  ) {}

  static create(id: OptionalValue<string>, onlyMine: boolean): Result<GetApplicationByIdQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    ).map((id) => new GetApplicationByIdQuery(id, onlyMine));
  }
}
