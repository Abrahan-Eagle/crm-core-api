import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { DeleteApplicationByIdCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id')
export class DeleteApplicationByIdResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.DELETE_APPLICATION)
  handle(@Req() req: Request, @Res() res: Response, @Param('application_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => DeleteApplicationByIdCommand.create(id).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
