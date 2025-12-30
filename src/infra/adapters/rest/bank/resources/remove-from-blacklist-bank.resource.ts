import { AbstractHttpResource } from '@internal/http';
import { Controller, Delete, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { RemoveFromBlacklistBankCommand } from '@/domain/bank';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/:bank_id')
export class RemoveFromBlacklistBankResource extends AbstractHttpResource {
  @Delete('blacklist')
  @RequiredPermissions(Permission.UPDATE_BANK)
  handle(@Req() req: Request, @Res() res: Response, @Param('bank_id') id: string): Observable<Response> {
    return of(id).pipe(
      map((bankId) => RemoveFromBlacklistBankCommand.create(bankId).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
