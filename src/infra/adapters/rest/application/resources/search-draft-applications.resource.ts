import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchDraftApplicationsResponse } from '@/app/application';
import { SearchDraftApplicationsQuery } from '@/domain/application';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/drafts')
export class SearchDraftApplicationsResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_DRAFT_APPLICATIONS, Permission.LIST_OWN_DRAFT_APPLICATIONS)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query('search') query: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() =>
        SearchDraftApplicationsQuery.create(
          pagination,
          query,
          requestHasPermission(Permission.LIST_OWN_DRAFT_APPLICATIONS, req),
        ).getOrThrow(),
      ),
      mergeMap((query) =>
        this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchDraftApplicationsResponse>>(query),
      ),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
