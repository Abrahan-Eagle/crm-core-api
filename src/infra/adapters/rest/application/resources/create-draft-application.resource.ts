import { catchInstanceOf, CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, IdResponse } from '@internal/http';
import { Controller, Inject, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateDraftApplicationRequest } from '@/app/application';
import { APPLICATION_FILE_MAX_FILE_SIZE, CreateDraftApplicationCommand } from '@/domain/application';
import { ApplicationDuplicated, FileDuplicated, Id } from '@/domain/common';
import { DynamicMappedBody, ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/public/applications')
export class CreateDraftApplicationResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'documents',
          maxCount: 4,
        },
        { name: 'signature', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: APPLICATION_FILE_MAX_FILE_SIZE,
        },
      },
    ),
  )
  @RequiredPermissions(Permission.CREATE_DRAFT_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles()
    files: {
      documents?: Express.Multer.File[];
      signature?: Express.Multer.File[];
    },
    @DynamicMappedBody() body: CreateDraftApplicationRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        CreateDraftApplicationCommand.create(
          data?.applicationId,
          data?.companyId,
          data?.loanAmount,
          data?.prospectId,
          data?.product,
          data?.referral,
          data.bankStatements,
          files.documents,
          this.getCurrentUserId() ? Id.load(this.getCurrentUserId()!) : null,
          data?.audience,
          files.signature?.at(0),
          data?.referralId,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<Id>(command)),
      map((id) => this.created(res, IdResponse.fromId(id))),
      catchInstanceOf(ApplicationDuplicated, (error) => this.conflict(req, res, error)),
      catchInstanceOf(FileDuplicated, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
