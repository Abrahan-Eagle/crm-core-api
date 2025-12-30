import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { AddNotificationsToApplicationRequest } from '@/app/application';
import { AddNotificationsToApplicationCommand } from '@/domain/application';
import { ApplicationBlocked, ApplicationPositionNotDefined, NotificationDuplicated } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/notifications')
export class AddNotificationsToApplicationToBanksResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_APPLICATION, Permission.SEND_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') id: string,
    @MappedBody() body: AddNotificationsToApplicationRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) => AddNotificationsToApplicationCommand.create(id, data?.message, data?.bankIds).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchInstanceOf(NotificationDuplicated, (error) => this.conflict(req, res, error)),
      catchInstanceOf(ApplicationPositionNotDefined, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
