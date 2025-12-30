import { OptionalValue, Result, Validator } from '@internal/common';
import { PaginationQuery } from '@internal/http';

import { DomainErrorCode, Id } from '@/domain/common';

const MAX_SEARCH_LENGTH = 100;
export class SearchProspectsQuery {
  private constructor(
    public readonly pagination: PaginationQuery,
    public readonly leadId: Id,
    public readonly search: string,
  ) {}

  static create(
    pagination: PaginationQuery,
    leadId: OptionalValue<string>,
    search: OptionalValue<string>,
  ): Result<SearchProspectsQuery> {
    return Result.combine([
      Id.create(
        leadId,
        () => DomainErrorCode.LEAD_ID_EMPTY,
        () => DomainErrorCode.LEAD_ID_INVALID,
      ),
      Validator.of(search)
        .string(() => DomainErrorCode.SEARCH_INVALID)
        .maxLength(MAX_SEARCH_LENGTH, () => DomainErrorCode.SEARCH_TOO_LONG)
        .mapIfAbsent(() => ''),
    ]).map(([id, search]) => new SearchProspectsQuery(pagination, id, search));
  }
}
