import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { NoteRequest } from '@/app/common';
import { Id } from '@/domain/common';
import { AddContactNoteCommand } from '@/domain/contact';
import { ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/contacts/:contact_id/notes')
export class AddContactNoteResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @RequiredPermissions(Permission.ADD_CONTACT_NOTE)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('contact_id') contactId: string,
    @MappedBody() body: NoteRequest,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => {
        return AddContactNoteCommand.create(
          Id.load(this.getCurrentUserId()!),
          contactId,
          body.id,
          body.level,
          body.description,
        ).getOrThrow();
      }),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
