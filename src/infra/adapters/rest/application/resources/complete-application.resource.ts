import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CompleteApplicationCommand } from '@/domain/application';
import { ApplicationBlocked, ApplicationNotApproved } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/complete')
export class CompleteApplicationResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => CompleteApplicationCommand.create(applicationId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchInstanceOf(ApplicationNotApproved, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
