import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { BankNotificationResponse } from '@/app/application';
import { GetBankNotificationsQuery } from '@/domain/application';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/notifications')
export class GetBankNotificationsResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_APPLICATION, Permission.READ_OWN_APPLICATION)
  handle(@Req() req: Request, @Res() res: Response, @Param('application_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => GetBankNotificationsQuery.create(id).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<BankNotificationResponse[]>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
