import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RestoreBankNotificationCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/notifications/:notification_id/restore')
export class RestoreBankNotificationResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Param('notification_id') notificationId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => RestoreBankNotificationCommand.create(applicationId, notificationId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand(command)),
      map(() => this.noContent(res)),

      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
