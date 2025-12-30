import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchContactResponse } from '@/app/contact';
import { SearchContactsQuery } from '@/domain/contact';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/contacts')
export class SearchContactsResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_CONTACTS, Permission.LIST_OWN_CONTACTS)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query('search') query: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() =>
        SearchContactsQuery.create(
          pagination,
          query,
          requestHasPermission(Permission.LIST_OWN_CONTACTS, req),
        ).getOrThrow(),
      ),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchContactResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
