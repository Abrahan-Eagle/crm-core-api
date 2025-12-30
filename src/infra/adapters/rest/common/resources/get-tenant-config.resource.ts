import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { TenantConfigResponse } from '@/app/common';
import { GetTenantConfigQuery } from '@/domain/common';

@Controller('v1/config')
export class GetTenantConfigResource extends AbstractHttpResource {
  @Get()
  handle(@Req() req: Request, @Res() res: Response, @Query('tenant') tenant: string): Observable<Response> {
    return of({}).pipe(
      map(() => GetTenantConfigQuery.create(tenant).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<TenantConfigResponse>(query)),
      map((data) => this.ok(res, data)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
