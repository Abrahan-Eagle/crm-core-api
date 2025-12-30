import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RoleResponse } from '@/app/user';
import { GetUserRolesQuery } from '@/domain/user';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users/roles')
export class GetUserRolesResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.CREATE_USER)
  handle(@Req() req: Request, @Res() res: Response): Observable<Response> {
    return of({}).pipe(
      map(() => GetUserRolesQuery.create().getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<RoleResponse[]>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
