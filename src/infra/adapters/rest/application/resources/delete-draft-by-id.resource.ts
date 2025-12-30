import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { DeleteDraftByIdCommand } from '@/domain/application';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/drafts/:draft_id')
export class DeleteDraftByIdResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.DELETE_DRAFT_APPLICATION)
  handle(@Req() req: Request, @Res() res: Response, @Param('draft_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => DeleteDraftByIdCommand.create(id).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
