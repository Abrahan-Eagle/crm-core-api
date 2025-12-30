import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateCommissionRequest } from '@/app/commission';
import { UpdateCommissionCommand } from '@/domain/commission';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/commissions/:commission_id')
export class UpdateCommissionResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_COMMISSION)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('commission_id') id: string,
    @MappedBody() body: UpdateCommissionRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map(({ commission, psf }) => UpdateCommissionCommand.create(id, commission, psf).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
