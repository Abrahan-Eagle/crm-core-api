import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { ApplicationResponse } from '@/app/application';
import { GetApplicationByIdQuery } from '@/domain/application';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id')
export class GetApplicationIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_APPLICATION, Permission.READ_OWN_APPLICATION)
  handle(@Req() req: Request, @Res() res: Response, @Param('application_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) =>
        GetApplicationByIdQuery.create(id, requestHasPermission(Permission.READ_OWN_APPLICATION, req)).getOrThrow(),
      ),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<ApplicationResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
