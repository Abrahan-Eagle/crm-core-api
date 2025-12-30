import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateUserRequest } from '@/app/user';
import { UpdateUserCommand } from '@/domain/user';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users/:user_id')
export class UpdateUserResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_USER)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('user_id') id: string,
    @MappedBody() body: UpdateUserRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) => UpdateUserCommand.create(id, data?.firstName, data?.lastName, data?.tenants).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
