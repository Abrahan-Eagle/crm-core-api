import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { AcceptOfferCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/notifications/:notification_id/accept/:offer_id')
export class AcceptOfferResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Param('notification_id') notificationId: string,
    @Param('offer_id') offerId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => AcceptOfferCommand.create(applicationId, notificationId, offerId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
