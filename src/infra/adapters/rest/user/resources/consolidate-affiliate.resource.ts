import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { ToggleUserRoleRequest } from '@/app/user';
import { AddRoleToUserCommand } from '@/domain/user';

@Controller('v1/webhooks/affiliate/consolidate')
export class ConsolidateAffiliateResource extends AbstractHttpResource {
  @Put()
  handle(@Req() req: Request, @Res() res: Response, @MappedBody() body: ToggleUserRoleRequest): Observable<Response> {
    return of(body).pipe(
      map((data) => AddRoleToUserCommand.create(data?.userId, 'rol_A3tdfj0JvuzJEqQk').getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
