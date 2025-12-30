import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CompanyResponse } from '@/app/company';
import { GetCompanyByTaxIdQuery } from '@/domain/company';

@Controller('v1/public/companies/:tax_id')
export class GetCompanyByTaxIdResource extends AbstractHttpResource {
  @Get()
  handle(@Req() req: Request, @Res() res: Response, @Param('tax_id') taxId: string): Observable<Response> {
    return of(taxId).pipe(
      map((taxId) => GetCompanyByTaxIdQuery.create(taxId).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<CompanyResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
