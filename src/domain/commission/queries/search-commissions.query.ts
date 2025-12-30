import { OptionalValue, Result, Validator } from '@internal/common';
import { PaginationQuery } from '@internal/http';

import { DomainErrorCode } from '@/domain/common';

const MAX_SEARCH_LENGTH = 100;
export class SearchCommissionsQuery {
  private constructor(
    public readonly pagination: PaginationQuery,
    public readonly search: string,
  ) {}

  static create(pagination: PaginationQuery, search: OptionalValue<string>): Result<SearchCommissionsQuery> {
    return Validator.of(search)
      .string(() => DomainErrorCode.SEARCH_INVALID)
      .maxLength(MAX_SEARCH_LENGTH, () => DomainErrorCode.SEARCH_TOO_LONG)
      .mapIfAbsent(() => '')
      .map((search) => new SearchCommissionsQuery(pagination, search));
  }
}
