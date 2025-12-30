import { AbstractHttpResource } from '@internal/http';
import { Body, Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateSubstatusRequest } from '@/app/application';
import { UpdateSubstatusCommand } from '@/domain/application';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/substatus')
export class UpdateSubstatusResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Body() body: UpdateSubstatusRequest,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => UpdateSubstatusCommand.create(applicationId, body?.substatus).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
