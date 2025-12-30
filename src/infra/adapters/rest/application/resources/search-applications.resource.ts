import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchApplicationsResponse } from '@/app/application';
import { SearchApplicationsQuery } from '@/domain/application';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications')
export class SearchApplicationsResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_APPLICATIONS, Permission.LIST_OWN_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query('search') query: string,
    @Query('period') period?: string,
    @Query('status') status?: string,
    @Query('company_id') companyId?: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() =>
        SearchApplicationsQuery.create(
          pagination,
          query,
          period,
          status,
          companyId,
          requestHasPermission(Permission.LIST_OWN_APPLICATION, req),
        ).getOrThrow(),
      ),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchApplicationsResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
