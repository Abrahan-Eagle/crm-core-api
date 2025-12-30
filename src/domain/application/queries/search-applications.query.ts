import { Nullable, OptionalValue, Result, Validator } from '@internal/common';
import { PaginationQuery } from '@internal/http';

import { DomainErrorCode, Id } from '@/domain/common';

import { APPLICATION_STATUS } from '../entities';

const MAX_SEARCH_LENGTH = 100;
export class SearchApplicationsQuery {
  private constructor(
    public readonly pagination: PaginationQuery,
    public readonly search: string,
    public readonly period: Nullable<string>,
    public readonly status: Nullable<APPLICATION_STATUS>,
    public readonly companyId: Nullable<Id>,
    public readonly onlyMine: boolean,
  ) {}

  static create(
    pagination: PaginationQuery,
    search: OptionalValue<string>,
    period: OptionalValue<string>,
    status: OptionalValue<string>,
    companyId: OptionalValue<string>,
    onlyMine: boolean,
  ): Result<SearchApplicationsQuery> {
    return Result.combine([
      Validator.of(search)
        .string(() => DomainErrorCode.SEARCH_INVALID)
        .maxLength(MAX_SEARCH_LENGTH, () => DomainErrorCode.SEARCH_TOO_LONG)
        .mapIfAbsent(() => ''),

      period
        ? Validator.of(period)
            .required(() => DomainErrorCode.APPLICATION_PERIOD_EMPTY)
            .string(() => DomainErrorCode.APPLICATION_PERIOD_INVALID)
            .map((value) => value.trim())
            .notEmpty(() => DomainErrorCode.APPLICATION_PERIOD_EMPTY)
            .regex(/^\d{4}-(0[1-9]|1[0-2])$/, () => DomainErrorCode.APPLICATION_PERIOD_INVALID)
        : Result.ok(null),

      (status !== undefined
        ? Validator.of(status)
            .required(() => DomainErrorCode.APPLICATION_STATUS_EMPTY)
            .string(() => DomainErrorCode.APPLICATION_STATUS_INVALID)
            .map((value) => value.trim())
            .enum(APPLICATION_STATUS, () => DomainErrorCode.APPLICATION_SUBSTATUS_INVALID)
        : Result.ok(null)) as Result<APPLICATION_STATUS | null>,
      companyId !== undefined
        ? Id.create(
            companyId,
            () => DomainErrorCode.COMPANY_ID_EMPTY,
            () => DomainErrorCode.COMPANY_ID_INVALID,
          )
        : Result.ok(null),
    ]).map(
      ([search, period, status, companyId]) =>
        new SearchApplicationsQuery(pagination, search, period, status, companyId, onlyMine),
    );
  }
}
