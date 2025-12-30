import { AbstractHttpResource } from '@internal/http';
import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { catchError, iif, map, mergeMap, Observable, of, tap } from 'rxjs';

import { CampaignComplaintRequest } from '@/app/campaign';
import { CampaignComplaintCommand } from '@/domain/campaign';

@Controller('v1/campaigns/notification')
export class CampaignComplaintResource extends AbstractHttpResource {
  @Post()
  handle(@Req() req: RawBodyRequest<Request>, @Res() res: Response): Observable<Response> {
    return of(
      plainToInstance(CampaignComplaintRequest, JSON.parse(JSON.parse(req.body || '{}')?.Message || '{}'), {
        excludeExtraneousValues: true,
      }),
    ).pipe(
      mergeMap((body) =>
        iif(
          () => req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation',
          of(body).pipe(tap(() => console.log(req.body))),
          of(body).pipe(
            map((body) =>
              CampaignComplaintCommand.create(
                body?.notificationType,
                body?.bounce?.bouncedRecipients?.map((data) => data.emailAddress) ||
                  body?.complaint?.complainedRecipients?.map((data) => data.emailAddress),
                body?.bounce?.timestamp || body?.complaint?.timestamp,
              ),
            ),
            map((command) => command.getOrThrow()),
            mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
          ),
        ),
      ),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
