import { AbstractHttpResource } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { PublishCommissionCommand } from '@/domain/commission';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/commissions/:commission_id/publish')
export class PublishCommissionResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_COMMISSION)
  handle(@Req() req: Request, @Res() res: Response, @Param('commission_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((id) => PublishCommissionCommand.create(id).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
