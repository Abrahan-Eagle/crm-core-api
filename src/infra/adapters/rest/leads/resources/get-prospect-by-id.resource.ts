import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { ProspectResponse } from '@/app/lead';
import { GetProspectByIdQuery } from '@/domain/leads';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/leads/:lead_id/prospects/:prospect_id')
export class GetProspectByIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_LEAD)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('lead_id') leadId: string,
    @Param('prospect_id') prospectId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => GetProspectByIdQuery.create(leadId, prospectId).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<ProspectResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
