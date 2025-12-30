import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { IndustryResponse } from '@/app/common';
import { GetIndustriesQuery } from '@/domain/common';

@Controller('v1/industries')
export class GetIndustriesResource extends AbstractHttpResource {
  @Get()
  handle(@Req() req: Request, @Res() res: Response): Observable<Response> {
    return of({}).pipe(
      map(() => GetIndustriesQuery.create().getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<IndustryResponse[]>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
