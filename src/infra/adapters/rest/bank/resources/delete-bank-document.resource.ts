import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { DeleteBankDocumentCommand } from '@/domain/bank';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/:bank_id/documents/:document_id')
export class DeleteBankDocumentResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.UPDATE_BANK)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('bank_id') bankId: string,
    @Param('document_id') documentId: string,
  ): Observable<Response> {
    return of({ bankId, documentId }).pipe(
      map(({ bankId, documentId }) => DeleteBankDocumentCommand.create(bankId, documentId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
