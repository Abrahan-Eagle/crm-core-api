import { catchInstanceOf, CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, IdResponse } from '@internal/http';
import { IdService, MongoConstant } from '@internal/mongo';
import { Controller, Inject, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateApplicationRequest } from '@/app/application';
import { APPLICATION_FILE_MAX_FILE_SIZE, CreateApplicationCommand } from '@/domain/application';
import { ApplicationDuplicated, FileDuplicated, Id } from '@/domain/common';
import { DynamicMappedBody, ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications')
export class CreateApplicationResource extends AbstractHttpResource {
  constructor(
    @Inject(MongoConstant.ID_SERVICE)
    private readonly idService: IdService,
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('documents', undefined, {
      limits: {
        fileSize: APPLICATION_FILE_MAX_FILE_SIZE,
      },
    }),
  )
  @RequiredPermissions(Permission.CREATE_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @DynamicMappedBody() body: CreateApplicationRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        CreateApplicationCommand.create(
          this.idService.generate(),
          data?.companyId,
          data?.loanAmount,
          data?.product,
          data?.referral,
          data.bankStatements,
          data?.mtdStatements,
          data?.creditCardStatements,
          data?.additionalStatements,
          files,
          this.getCurrentUserId() ? Id.load(this.getCurrentUserId()!) : null,
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
