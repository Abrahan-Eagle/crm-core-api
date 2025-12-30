import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UserResponse } from '@/app/user';
import { GetUserByIdQuery } from '@/domain/user';
import { ExtendedAuthContextStorage } from '@/infra/common';

@Controller('v1/users/me')
export class GetUserByIdResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, context);
  }

  @Get()
  handle(@Req() req: Request, @Res() res: Response): Observable<Response> {
    return of(this.getCurrentUserId()).pipe(
      map((id) => GetUserByIdQuery.create(id).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<UserResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
