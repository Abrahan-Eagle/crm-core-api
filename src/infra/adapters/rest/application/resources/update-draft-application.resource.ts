import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Body, Controller, Inject, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateDraftApplicationRequest } from '@/app/application';
import { UpdateDraftApplicationCommand } from '@/domain/application';
import { ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/drafts/:application_id')
export class UpdateDraftApplicationResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Put()
  @RequiredPermissions(Permission.UPDATE_DRAFT_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('application_id') applicationId: string,
    @Body() body: UpdateDraftApplicationRequest[],
  ): Observable<Response> {
    return of(body).pipe(
      map((data) => UpdateDraftApplicationCommand.create(applicationId, data).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
