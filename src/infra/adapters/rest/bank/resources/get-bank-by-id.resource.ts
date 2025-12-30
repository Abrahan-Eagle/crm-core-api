import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { BankResponse } from '@/app/bank';
import { GetBankByIdQuery } from '@/domain/bank';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/:bank_id')
export class GetBankByIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_BANK)
  handle(@Req() req: Request, @Res() res: Response, @Param('bank_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => GetBankByIdQuery.create(id).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<BankResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
