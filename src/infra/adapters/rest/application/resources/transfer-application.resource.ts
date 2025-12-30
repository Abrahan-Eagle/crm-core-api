import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { TransferApplicationCommand } from '@/domain/application';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/transfer-to/:user_id')
export class TransferApplicationResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.TRANSFER_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Param('user_id') userId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => TransferApplicationCommand.create(applicationId, userId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
