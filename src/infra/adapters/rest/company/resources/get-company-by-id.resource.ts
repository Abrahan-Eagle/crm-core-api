import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CompanyResponse } from '@/app/company';
import { GetCompanyByIdQuery } from '@/domain/company';
import { Permission, requestHasPermission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/:company_id')
export class GetCompanyByIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_COMPANY, Permission.READ_OWN_COMPANY)
  handle(@Req() req: Request, @Res() res: Response, @Param('company_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => GetCompanyByIdQuery.create(id, requestHasPermission(Permission.READ_OWN_COMPANY, req)).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<CompanyResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
