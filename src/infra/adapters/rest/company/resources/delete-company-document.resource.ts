import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { DeleteCompanyDocumentCommand } from '@/domain/company';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/:company_id/documents/:document_id')
export class DeleteBankDocumentResource extends AbstractHttpResource {
  @Delete()
  @RequiredPermissions(Permission.UPDATE_COMPANY)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('company_id') companyId: string,
    @Param('document_id') documentId: string,
  ): Observable<Response> {
    return of({ companyId, documentId }).pipe(
      map(({ companyId, documentId }) => DeleteCompanyDocumentCommand.create(companyId, documentId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
