import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchCommissionsResponse } from '@/app/commission';
import { SearchCommissionsQuery } from '@/domain/commission';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/commissions')
export class SearchCommissionsResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_COMMISSIONS)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query('search') query: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => SearchCommissionsQuery.create(pagination, query).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchCommissionsResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
