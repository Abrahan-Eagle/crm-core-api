import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { TransferDraftCommand } from '@/domain/application';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/drafts/:draft_id/transfer-to/:user_id')
export class TransferDraftResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.TRANSFER_DRAFT)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('draft_id') draftId: string,
    @Param('user_id') userId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => TransferDraftCommand.create(draftId, userId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
