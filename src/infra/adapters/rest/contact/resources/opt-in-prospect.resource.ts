import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { OptInProspectRequest } from '@/app/contact';
import { OptInProspectCommand } from '@/domain/contact';

@Controller('v1/public/prospects')
export class OptInProspectResource extends AbstractHttpResource {
  @Post()
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: OptInProspectRequest): Observable<Response> {
    return of({}).pipe(
      map(() =>
        OptInProspectCommand.create(
          body.firstName,
          body.lastName,
          body.phone,
          body.email,
          body.loan_amount,
          body.audience,
          body.lang,
          body.referral,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<{ id: number }>(command)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
