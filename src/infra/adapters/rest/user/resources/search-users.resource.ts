import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UserResponse } from '@/app/user';
import { SearchUsersQuery } from '@/domain/user';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users')
export class SearchUsersResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_USER)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Query('search') query: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => SearchUsersQuery.create(pagination, query).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<UserResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
