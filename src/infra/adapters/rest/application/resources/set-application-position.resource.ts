import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Patch, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SetApplicationPositionCommand } from '@/domain/application';
import { ApplicationBlocked, ApplicationPositionNotDefined } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/position/:position')
export class SetApplicationPositionResource extends AbstractHttpResource {
  @Patch()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Param('position') position: number,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => SetApplicationPositionCommand.create(applicationId, position).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(ApplicationPositionNotDefined, (error) => this.conflict(req, res, error)),
      catchInstanceOf(ApplicationBlocked, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
