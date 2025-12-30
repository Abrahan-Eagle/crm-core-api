import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RemoveContactNoteCommand } from '@/domain/contact';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/contacts/:contact_id/notes/:note_id')
export class RemoveContactNoteResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.DELETE_CONTACT_NOTE)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('contact_id') contactId: string,
    @Param('note_id') noteId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => RemoveContactNoteCommand.create(contactId, noteId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
