import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchBankResponse, SearchBanksRequest } from '@/app/bank';
import { SearchBanksQuery } from '@/domain/bank';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks')
export class SearchBanksResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_BANKS)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query() query: SearchBanksRequest,
  ): Observable<Response> {
    return of({}).pipe(
      map(() =>
        SearchBanksQuery.create(
          pagination,
          query?.search,
          query?.classifications,
          query?.territories,
          query?.countries,
          query?.status,
          query?.bank_type,
          query?.deposits_minimum_amount,
          query?.maximum_negative_days,
          query?.maximum_negative_days,
          query?.minimum_daily_balance,
          query?.loan_limit,
          query?.minimum_months_in_business,
          query?.supported_ids,
          query?.allowed_industries,
          query?.positions,
          query?.identification_types,
          query?.blacklisted,
        ).getOrThrow(),
      ),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchBankResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
