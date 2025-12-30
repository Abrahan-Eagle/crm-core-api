import { catchInstanceOf, CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Inject, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { PublishDraftApplicationCommand } from '@/domain/application';
import { ApplicationDraftIncompleted } from '@/domain/common';
import { ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/drafts/:draft_id/publish')
export class PublishDraftApplicationResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Put()
  @RequiredPermissions(Permission.PUBLISH_DRAFT_APPLICATION)
  handle(@Req() req: Request, @Res() res: Response, @Param('draft_id') draftId: string): Observable<Response> {
    return of({}).pipe(
      map(() => PublishDraftApplicationCommand.create(draftId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(ApplicationDraftIncompleted, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
