import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateCompanyRequest } from '@/app/company';
import { UpdateCompanyCommand } from '@/domain/company';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/:company_id')
export class UpdateCompanyResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_COMPANY)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('company_id') id: string,
    @MappedBody() body: UpdateCompanyRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        UpdateCompanyCommand.create(
          id,
          data?.companyName,
          data?.dba,
          data?.industry,
          data?.service,
          data?.creationDate,
          data?.entityType,
          data?.phoneNumbers,
          data?.emails,
          data?.address,
          data?.members,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
