import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { NoteWithReminderRequest } from '@/app/common';
import { Id } from '@/domain/common';
import { AddNoteToProspectCommand } from '@/domain/leads';
import { DynamicMappedBody, ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/leads/:lead_id/prospects/:prospect_id/notes')
export class AddNoteToProspectResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @RequiredPermissions(Permission.ADD_PROSPECT_NOTE)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('lead_id') leadId: string,
    @Param('prospect_id') prospectId: string,
    @DynamicMappedBody() body: NoteWithReminderRequest,
  ): Observable<Response> {
    return of({}).pipe(
      map(() =>
        AddNoteToProspectCommand.create(
          Id.load(this.getCurrentUserId()!),
          leadId,
          prospectId,
          body?.id,
          body?.description,
          body?.follow_up_call,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
