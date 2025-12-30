import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { StartCampaignCommand } from '@/domain/campaign';

@Controller('v1/campaigns/:campaign_id/start')
export class StartCampaignResource extends AbstractHttpResource {
  @Put()
  handle(@Req() req: Request, @Res() res: Response, @Param('campaign_id') id: string): Observable<Response> {
    return of({}).pipe(
      map(() => StartCampaignCommand.create(id).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
