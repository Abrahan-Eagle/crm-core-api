import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateOfferRequest } from '@/app/application';
import { CreateOfferCommand } from '@/domain/application';
import { ApplicationBlocked } from '@/domain/common';
import { DynamicMappedBody, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/notifications/:notification_id')
export class CreateOfferResource extends AbstractHttpResource {
  @Post()
  @RequiredPermissions(Permission.UPDATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Param('notification_id') notificationId: string,
    @DynamicMappedBody() body: CreateOfferRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((body) =>
        CreateOfferCommand.create(
          body?.id,
          applicationId,
          notificationId,
          body?.purchasedAmount,
          body?.factorRate,
          body?.position,
          body?.points,
          body?.paymentPlan,
          body?.paymentPlanDuration,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),

      catchInstanceOf(ApplicationBlocked, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
