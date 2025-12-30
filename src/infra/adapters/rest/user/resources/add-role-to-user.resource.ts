import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { ToggleUserRoleRequest } from '@/app/user';
import { AddRoleToUserCommand } from '@/domain/user';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users/roles/add')
export class AddRoleToUserResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_USER)
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: ToggleUserRoleRequest): Observable<Response> {
    return of(body).pipe(
      map((data) => AddRoleToUserCommand.create(data?.userId, data?.role).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
