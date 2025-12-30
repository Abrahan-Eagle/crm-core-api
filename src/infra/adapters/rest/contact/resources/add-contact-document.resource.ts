import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { FileDuplicated } from '@/domain/common';
import { AddContactDocumentCommand, CONTACT_FILE_MAX_FILE_SIZE } from '@/domain/contact';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/contacts/:contact_id/documents/:type')
export class AddContactDocumentResource extends AbstractHttpResource {
  @Put()
  @UseInterceptors(
    FileInterceptor('document', {
      limits: {
        fileSize: CONTACT_FILE_MAX_FILE_SIZE,
      },
    }),
  )
  @RequiredPermissions(Permission.UPDATE_CONTACT)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('contact_id') id: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => AddContactDocumentCommand.create(id, type, file).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchInstanceOf(FileDuplicated, (error) => this.conflict(req, res, error)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
