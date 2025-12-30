import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { AddBankDocumentCommand, BANK_FILE_MAX_FILE_SIZE } from '@/domain/bank';
import { FileDuplicated } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/:bank_id/documents')
export class AddBankDocumentResource extends AbstractHttpResource {
  @Put()
  @UseInterceptors(
    FileInterceptor('document', {
      limits: {
        fileSize: BANK_FILE_MAX_FILE_SIZE,
      },
    }),
  )
  @RequiredPermissions(Permission.UPDATE_BANK)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('bank_id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => AddBankDocumentCommand.create(id, file).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(FileDuplicated, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
