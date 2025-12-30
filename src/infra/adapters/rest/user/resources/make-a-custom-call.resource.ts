import { catchInstanceOf, CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { PhoneRequest } from '@/app/common';
import { CallFailed } from '@/domain/common';
import { MakeACustomCallCommand } from '@/domain/user';
import { ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/users/make-a-custom-call')
export class MakeACustomCallResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @RequiredPermissions(Permission.REQUEST_CUSTOM_CALL)
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: PhoneRequest): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        MakeACustomCallCommand.create(
          this.getCurrentUserId(),
          data?.intlPrefix,
          data?.regionCode,
          data?.number,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(CallFailed, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
