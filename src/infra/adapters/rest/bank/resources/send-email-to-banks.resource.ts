import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SendEmailToBanksRequest } from '@/app/bank';
import { SendEmailToBanksCommand } from '@/domain/bank';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/send-email')
export class SendEmailToBanksResource extends AbstractHttpResource {
  @Post()
  @RequiredPermissions(Permission.SEND_EMAIL_TO_BANKS)
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: SendEmailToBanksRequest): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        SendEmailToBanksCommand.create(data?.bankIds, data?.subject, data?.message, data?.attachments).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
