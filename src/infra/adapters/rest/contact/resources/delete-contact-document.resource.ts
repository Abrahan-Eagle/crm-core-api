import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { DeleteContactDocumentCommand } from '@/domain/contact';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/contacts/:contact_id/documents/:document_id')
export class DeleteContactDocumentResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.UPDATE_CONTACT)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('contact_id') contactId: string,
    @Param('document_id') documentId: string,
  ): Observable<Response> {
    return of({ contactId, documentId }).pipe(
      map(({ contactId, documentId }) => DeleteContactDocumentCommand.create(contactId, documentId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
