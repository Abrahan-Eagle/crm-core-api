import { CommonConstant, MessageDispatcher } from '@internal/common';
import { AbstractHttpResource } from '@internal/http';
import { Controller, Inject, Param, Patch, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { BlacklistBankRequest } from '@/app/bank';
import { SendBankToBlackListCommand } from '@/domain/bank';
import { DynamicMappedBody, ExtendedAuthContextStorage, Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/:bank_id/blacklist')
export class SendBankToBlackListResource extends AbstractHttpResource {
  constructor(
    @Inject(CommonConstant.MESSAGE_DISPATCHER)
    messageDispatcher: MessageDispatcher,
    authContext: ExtendedAuthContextStorage,
  ) {
    super(messageDispatcher, authContext);
  }

  @Patch()
  @RequiredPermissions(Permission.UPDATE_BANK)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('bank_id') id: string,
    @DynamicMappedBody() body: BlacklistBankRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) => SendBankToBlackListCommand.create(id, this.getCurrentUserId(), data.note).getOrThrow()),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
