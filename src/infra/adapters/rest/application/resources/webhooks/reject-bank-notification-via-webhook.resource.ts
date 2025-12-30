import { catchInstanceOf, NotFound } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RejectBankNotificationViaWebhookRequest } from '@/app/application';
import { RejectBankNotificationViaWebhookCommand } from '@/domain/application';
import { DynamicMappedBody } from '@/infra/common';

@Controller('v1/webhooks/applications/notification/reject')
export class RejectBankNotificationViaWebhookResource extends AbstractHttpResource {
  @Put()
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @DynamicMappedBody() body: RejectBankNotificationViaWebhookRequest,
  ): Observable<Response> {
    return of({}).pipe(
      map(() =>
        RejectBankNotificationViaWebhookCommand.create(
          (body?.subject ?? '').match(/#([a-z0-9]{12})#/)?.at(1) ?? '',
          body.sender,
          body.reason,
          body?.other,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      catchInstanceOf(NotFound, () => this.noContent(res)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
