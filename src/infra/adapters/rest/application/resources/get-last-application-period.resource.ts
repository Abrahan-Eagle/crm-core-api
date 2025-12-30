import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { GetLastApplicationPeriodQuery } from '@/domain/application';

@Controller('v1/last-application-period/:company_id')
export class GetLasApplicationPeriodResource extends AbstractHttpResource {
  @Get()
  handle(@Req() req: Request, @Res() res: Response, @Param('company_id') companyId: string): Observable<Response> {
    return of({}).pipe(
      map(() => GetLastApplicationPeriodQuery.create(companyId).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<string | null>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
