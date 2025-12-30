import { catchInstanceOf, CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { MakeACallRequest } from '@/app/user';
import { CallFailed } from '@/domain/common';
import { MakeACallCommand } from '@/domain/user';
import { ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users/make-a-call')
export class MakeACallResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @RequiredPermissions(Permission.REQUEST_CALL)
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: MakeACallRequest): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        MakeACallCommand.create(
          this.getCurrentUserId(),
          data?.entityType,
          data?.entityId,
          data?.phoneIndex,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(CallFailed, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
