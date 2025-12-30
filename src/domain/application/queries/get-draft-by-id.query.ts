import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetDraftByIdQuery {
  private constructor(
    public readonly id: Id,
    public readonly onlyMine: boolean,
  ) {}

  static create(id: OptionalValue<string>, onlyMine: boolean): Result<GetDraftByIdQuery> {
    return Id.create(
      id,
      () => DomainErrorCode.DRAFT_ID_EMPTY,
      () => DomainErrorCode.DRAFT_ID_INVALID,
    ).map((id) => new GetDraftByIdQuery(id, onlyMine));
  }
}
