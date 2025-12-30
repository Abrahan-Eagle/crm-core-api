import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { ContactResponse } from '@/app/contact';
import { GetContactBySSNQuery } from '@/domain/contact';

@Controller('v1/public/contacts/:ssn')
export class GetContactBySSNResource extends AbstractHttpResource {
  @Get()
  handle(@Req() req: Request, @Res() res: Response, @Param('ssn') ssn: string): Observable<Response> {
    return of(ssn).pipe(
      map((ssn) => GetContactBySSNQuery.create(ssn).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<ContactResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
