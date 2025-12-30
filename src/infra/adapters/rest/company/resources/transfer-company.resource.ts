import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { TransferCompanyCommand } from '@/domain/company';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/:company_id/transfer-to/:user_id')
export class TransferCompanyResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.TRANSFER_COMPANY)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('company_id') companyId: string,
    @Param('user_id') userId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => TransferCompanyCommand.create(companyId, userId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
