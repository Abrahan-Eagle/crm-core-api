import { catchInstanceOf, CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource, IdResponse } from '@internal/http';
import { Controller, Inject, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateCompanyRequest } from '@/app/company';
import { CompanyDuplicated, FileDuplicated, Id } from '@/domain/common';
import {
  COMPANY_FILE_MAX_FILE_SIZE,
  CreateCompanyCommand,
  MAX_COMPANY_FILE_PER_TYPE,
  SUPPORTED_COMPANY_FILES,
} from '@/domain/company';
import { DynamicMappedBody, ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

type CompanyFiles = Record<string, Express.Multer.File[]>;

@Controller('v1/companies')
export class CreateCompanyResource extends AbstractHttpResource {
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
      Object.values(SUPPORTED_COMPANY_FILES).map((id) => ({ name: id, maxCount: MAX_COMPANY_FILE_PER_TYPE })),
      {
        limits: {
          fileSize: COMPANY_FILE_MAX_FILE_SIZE,
        },
      },
    ),
  )
  @RequiredPermissions(Permission.CREATE_COMPANY)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files: CompanyFiles,
    @DynamicMappedBody() body: CreateCompanyRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        CreateCompanyCommand.create(
          data?.id,
          data?.companyName,
          data?.dba,
          data?.taxId,
          data?.industry,
          data?.service,
          data.creationDate,
          data?.entityType,
          data?.phoneNumbers,
          data?.emails,
          data?.address,
          data?.members,
          files,
          data?.note,
          this.getCurrentUserId() ? Id.load(this.getCurrentUserId()!) : null,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<Id>(command)),
      map((id) => this.created(res, IdResponse.fromId(id))),
      catchInstanceOf(CompanyDuplicated, (error) => this.conflict(req, res, error)),
      catchInstanceOf(FileDuplicated, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
