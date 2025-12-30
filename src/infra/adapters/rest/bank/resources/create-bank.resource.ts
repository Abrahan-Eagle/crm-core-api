import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource, IdResponse } from '@internal/http';
import { Controller, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CreateBankRequest } from '@/app/bank';
import { BANK_FILE_MAX_FILE_SIZE, BANK_MAX_FILES, CreateBankCommand } from '@/domain/bank';
import { BankDuplicated, FileDuplicated, Id } from '@/domain/common';
import { DynamicMappedBody, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks')
export class CreateBankResource extends AbstractHttpResource {
  @Post()
  @UseInterceptors(
    FilesInterceptor('documents', BANK_MAX_FILES, {
      limits: {
        fileSize: BANK_FILE_MAX_FILE_SIZE,
      },
    }),
  )
  @RequiredPermissions(Permission.CREATE_BANK)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @DynamicMappedBody() body: CreateBankRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        CreateBankCommand.create(
          data?.id,
          data?.bankName,
          data?.manager,
          data?.bankType,
          data?.address,
          data?.contacts,
          data?.constraints,
          files,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<Id>(command)),
      map((id) => this.created(res, IdResponse.fromId(id))),
      catchInstanceOf(BankDuplicated, (error) => this.conflict(req, res, error)),
      catchInstanceOf(FileDuplicated, (error) => this.badRequest(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
