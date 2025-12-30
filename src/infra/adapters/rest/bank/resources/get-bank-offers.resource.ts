import { AbstractHttpResource, PaginatedQuery, PaginatedResponse, PaginationQuery } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { SearchBankResponse } from '@/app/bank';
import { GetBankOffersQuery } from '@/domain/bank';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/:bank_id/offers')
export class GetBankOffersResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_APPLICATION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @PaginatedQuery() pagination: PaginationQuery,
    @Param('bank_id') bankId: string,
  ): Observable<Response> {
    return of({}).pipe(
      map(() => GetBankOffersQuery.create(pagination, bankId).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<PaginatedResponse<SearchBankResponse>>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
