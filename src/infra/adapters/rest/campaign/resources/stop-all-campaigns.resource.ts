import { AbstractHttpResource } from '@internal/http';
import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, iif, map, mergeMap, Observable, of, tap } from 'rxjs';

import { StopAllCampaignsCommand } from '@/domain/campaign';

@Controller('v1/campaigns/stop-all')
export class StopAllCampaignsResource extends AbstractHttpResource {
  @Post()
  handle(@Req() req: RawBodyRequest<Request>, @Res() res: Response): Observable<Response> {
    return of({}).pipe(
      mergeMap((body) =>
        iif(
          () => req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation',
          of(body).pipe(tap(() => console.log(req.body))),
          of(body).pipe(
            map(() => StopAllCampaignsCommand.create().getOrThrow()),
            mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
          ),
        ),
      ),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
