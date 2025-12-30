import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CompanyResponse } from '@/app/company';
import { GetCompaniesByContactIdQuery } from '@/domain/company';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/companies/contact/:contact_id')
export class CompaniesByContactIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.LIST_COMPANIES)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('contact_id') contactId: string,
    @PaginatedQuery() pagination: PaginationQuery,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => GetCompaniesByContactIdQuery.create(contactId, pagination).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<CompanyResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
