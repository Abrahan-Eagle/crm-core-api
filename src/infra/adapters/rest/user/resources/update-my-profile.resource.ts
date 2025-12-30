import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Inject, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateMyProfileRequest } from '@/app/user';
import { UpdateMyProfileCommand } from '@/domain/user';
import { ExtendedAuthContextStorage } from '@/infra/common';

@Controller('v1/users')
export class UpdateMyProfileResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Put()
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: UpdateMyProfileRequest): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        UpdateMyProfileCommand.create(
          this.getCurrentUserId(),
          data?.firstName,
          data?.lastName,
          body?.phone,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
