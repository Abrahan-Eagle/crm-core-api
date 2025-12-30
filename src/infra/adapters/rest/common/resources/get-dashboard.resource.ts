import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { GetDashboardQuery } from '@/domain/common';
import { ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/dashboard')
export class GetDashboardResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, context);
  }

  @Get()
  @RequiredPermissions(Permission.READ_DASHBOARD)
  handle(@Req() req: Request, @Res() res: Response): Observable<Response> {
    return of(this.getCurrentUserId()).pipe(
      map(() => GetDashboardQuery.create().getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<string>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
