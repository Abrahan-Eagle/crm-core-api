import { catchInstanceOf } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RecommendedBankResponse } from '@/app/application';
import { GetRecommendedBanksQuery } from '@/domain/application';
import { ApplicationPositionNotDefined } from '@/domain/common';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/applications/:application_id/recommended-banks')
export class GetRecommendedBanksResource extends AbstractHttpResource {
  @Get()
  @RequiredPermissions(Permission.READ_APPLICATION)
  handle(@Req() req: Request, @Res() res: Response, @Param('application_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => GetRecommendedBanksQuery.create(id).getOrThrow()),
      mergeMap((query) => this.messageDispatcher.dispatchQuery<RecommendedBankResponse[]>(query)),
      map((data) => this.ok(res, data)),
      catchInstanceOf(ApplicationPositionNotDefined, (error: ApplicationPositionNotDefined) =>
        this.conflict(req, res, error),
      ),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
