import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { DraftResponse } from '@/app/application';
import { GetDraftByIdQuery } from '@/domain/application';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/drafts/:draft_id')
export class GetDraftByIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_DRAFT_APPLICATION, Permission.READ_OWN_DRAFT_APPLICATION)
  handle(@Req() req: Request, @Res() res: Response, @Param('draft_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) =>
        GetDraftByIdQuery.create(id, requestHasPermission(Permission.READ_OWN_DRAFT_APPLICATION, req)).getOrThrow(),
      ),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<DraftResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
