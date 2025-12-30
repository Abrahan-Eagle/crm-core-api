import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { FileDuplicated } from '@/domain/common';
import { AddCompanyDocumentCommand, COMPANY_FILE_MAX_FILE_SIZE } from '@/domain/company';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/:company_id/documents/:type')
export class AddCompanyDocumentResource extends AbstractHttpResource {
  @Put()
  @UseInterceptors(
    FileInterceptor('document', {
      limits: {
        fileSize: COMPANY_FILE_MAX_FILE_SIZE,
      },
    }),
  )
  @RequiredPermissions(Permission.UPDATE_COMPANY)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('company_id') id: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => AddCompanyDocumentCommand.create(id, file, type).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(FileDuplicated, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
