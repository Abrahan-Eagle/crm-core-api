import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { TransferLeadPropertyCommand } from '@/domain/leads';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/leads/:lead_id/transfer/:to_user_id')
export class TransferLeadPropertyResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.TRANSFER_LEAD)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('lead_id') leadId: string,
    @Param('to_user_id') userId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => TransferLeadPropertyCommand.create(leadId, userId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
