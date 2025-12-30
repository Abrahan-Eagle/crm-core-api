import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Patch, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RejectBankNotificationRequest } from '@/app/application';
import { RejectBankNotificationCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';
import { DynamicMappedBody, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/notifications/:notification_id')
export class RejectBankNotificationResource extends AbstractHttpResource {
  @Patch()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Param('notification_id') notificationId: string,
    @DynamicMappedBody() body: RejectBankNotificationRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((body) =>
        RejectBankNotificationCommand.create(applicationId, notificationId, body?.reason, body?.other).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand(command)),
      map(() => this.noContent(res)),

      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
