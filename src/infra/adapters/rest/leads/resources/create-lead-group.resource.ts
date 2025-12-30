import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Inject, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateLeadRequest, LeadCreatedResponse } from '@/app/lead';
import { CreateLeadCommand, LEAD_FILE_MAX_FILE_SIZE } from '@/domain/leads';
import { DynamicMappedBody, ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/leads')
export class CreateLeadGroupResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: LEAD_FILE_MAX_FILE_SIZE,
      },
    }),
  )
  @RequiredPermissions(Permission.CREATE_LEAD)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @DynamicMappedBody() body: CreateLeadRequest,
  ): Observable<Response> {
    return of(body).pipe(
      mergeMap((data) =>
        CreateLeadCommand.create(data?.id, data?.name, data?.assignedTo, this.getCurrentUserId(), file),
      ),
      map((command) => command.getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<LeadCreatedResponse>(command)),
      map((data) => this.created(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
