import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { DisableUserCommand } from '@/domain/user';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users/disable/:user_id')
export class DisableUserResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.UPDATE_USER)
  handle(@Req() req: Request, @Res() res: Response, @Param('user_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => DisableUserCommand.create(id).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
