import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { NoteRequest } from '@/app/common';
import { Id } from '@/domain/common';
import { AddCompanyNoteCommand } from '@/domain/company';
import { ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/:company_id/notes')
export class AddCompanyNoteResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @RequiredPermissions(Permission.ADD_COMPANY_NOTE)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('company_id') companyId: string,
    @MappedBody() body: NoteRequest,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => {
        return AddCompanyNoteCommand.create(
          Id.load(this.getCurrentUserId()!),
          companyId,
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
