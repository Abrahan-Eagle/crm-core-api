import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CampaignResponse } from '@/app/campaign';
import { GetCampaignsQuery } from '@/domain/campaign';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/campaigns')
export class GetCampaignsResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_CAMPAIGNS)
  handle(@Req() req: Request, @Res() res: Response): Observable<Response> {
    return of({}).pipe(
      map(() => GetCampaignsQuery.create().getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<CampaignResponse[]>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
