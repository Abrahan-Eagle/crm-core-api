import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchLeadResponse } from '@/app/lead';
import { SearchLeadQuery } from '@/domain/leads';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/leads')
export class SearchLeadsResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_LEADS, Permission.LIST_OWN_LEADS)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query('search') query: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => SearchLeadQuery.create(pagination, query).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchLeadResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
