import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { CommissionResponse } from '@/app/commission';
import { GetCommissionByIdQuery } from '@/domain/commission';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/commissions/:commission_id')
export class GetCommissionIdResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_COMMISSION)
  handle(@Req() req: Request, @Res() res: Response, @Param('commission_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => GetCommissionByIdQuery.create(id).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<CommissionResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
