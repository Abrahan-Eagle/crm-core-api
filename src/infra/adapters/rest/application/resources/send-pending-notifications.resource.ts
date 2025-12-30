import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SendPendingNotificationsRequest } from '@/app/application';
import { SendPendingNotificationsCommand } from '@/domain/application';

@Controller('v1/applications/:application_id/send-to-banks')
export class SendPendingNotificationsResource extends AbstractHttpResource {
  @Put()
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') id: string,
    @MappedBody() body: SendPendingNotificationsRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) => SendPendingNotificationsCommand.create(id, data?.message).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
