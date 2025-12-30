import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Patch, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RejectApplicationRequest } from '@/app/application';
import { RejectApplicationCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';
import { DynamicMappedBody, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/reject')
export class RejectApplicationResource extends AbstractHttpResource {
  @Patch()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @DynamicMappedBody() body: RejectApplicationRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((body) => RejectApplicationCommand.create(applicationId, body?.reason, body?.other).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
