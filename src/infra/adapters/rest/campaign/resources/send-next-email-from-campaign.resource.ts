import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SendNextEmailFromCampaignCommand } from '@/domain/campaign';
import { CampaignFinish } from '@/domain/common';

@Controller('v1/campaigns/:campaign_id/send-next')
export class SendNextEmailFromCampaignResource extends AbstractHttpResource {
  @Get()
  handle(@Req() req: Request, @Res() res: Response, @Param('campaign_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => SendNextEmailFromCampaignCommand.create(id).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(CampaignFinish, () => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
