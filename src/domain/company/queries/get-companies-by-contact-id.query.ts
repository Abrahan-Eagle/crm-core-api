import { OptionalValue, Result } from '@internal/common';
import { PaginationQuery } from '@internal/http';

import { DomainErrorCode, Id } from '@/domain/common';

export class GetCompaniesByContactIdQuery {
  private constructor(
    public readonly contactId: Id,
    public readonly pagination: PaginationQuery,
  ) {}

  static create(contactId: OptionalValue<string>, pagination: PaginationQuery): Result<GetCompaniesByContactIdQuery> {
    return Id.create(
      contactId,
      () => DomainErrorCode.CONTACT_ID_EMPTY,
      () => DomainErrorCode.CONTACT_ID_INVALID,
    ).map((id) => new GetCompaniesByContactIdQuery(id, pagination));
  }
}
