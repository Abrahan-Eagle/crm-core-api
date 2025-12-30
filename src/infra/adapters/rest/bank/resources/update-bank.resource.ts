import { AbstractHttpResource, MappedBody } from '@internal/http';
import { Controller, Param, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';

import { UpdateBankRequest } from '@/app/bank';
import { UpdateBankCommand } from '@/domain/bank';
import { Permission, RequiredPermissions } from '@/infra/common';

@Controller('v1/banks/:bank_id')
export class UpdateBankResource extends AbstractHttpResource {
  @Put()
  @RequiredPermissions(Permission.UPDATE_BANK)
  handle(
    @Req() req: Request,
    @Res() res: Response,
    @Param('bank_id') id: string,
    @MappedBody() body: UpdateBankRequest,
  ): Observable<Response> {
    return of(body).pipe(
      map((data) =>
        UpdateBankCommand.create(
          id,
          data?.bankName,
          data?.bankType,
          data?.manager,
          data?.address,
          data?.contacts,
          data?.constraints?.classifications,
          data?.constraints?.territories,
          data?.constraints?.deposits,
          data?.constraints?.loanLimit,
          data?.constraints?.hasLoanLimit,
          data?.constraints?.minimumLoan,
          data?.constraints?.minimumMonthsInBusiness,
          data?.constraints?.minimumDailyBalance,
          data?.constraints?.maximumNegativeDays,
          data?.constraints?.allowedIndustries,
          data?.constraints?.supportedIDs,
          data?.constraints?.positions,
          data?.constraints?.blockedProducts,
        ).getOrThrow(),
      ),
      mergeMap((command) => this.messageDispatcher.dispatchCommand<void>(command)),
      map(() => this.noContent(res)),
      catchError((error) => of(this.handleError(req, res, error))),
    );
  }
}
