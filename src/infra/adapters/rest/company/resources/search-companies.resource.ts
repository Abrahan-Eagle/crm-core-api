import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchCompanyResponse } from '@/app/company';
import { SearchCompaniesQuery } from '@/domain/company';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies')
export class SearchCompaniesResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_COMPANIES, Permission.LIST_OWN_COMPANIES)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query('search') query: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() =>
        SearchCompaniesQuery.create(
          pagination,
          query,
          requestHasPermission(Permission.LIST_OWN_COMPANIES, req),
        ).getOrThrow(),
      ),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchCompanyResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
