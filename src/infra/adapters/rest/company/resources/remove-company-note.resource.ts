import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RemoveCompanyNoteCommand } from '@/domain/company';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/:company_id/notes/:note_id')
export class RemoveCompanyNoteResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.DELETE_COMPANY_NOTE)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('company_id') companyId: string,
    @Param('note_id') noteId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => RemoveCompanyNoteCommand.create(companyId, noteId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
