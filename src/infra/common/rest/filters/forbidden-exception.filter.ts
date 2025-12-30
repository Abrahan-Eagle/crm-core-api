import { HEADER_REQUEST_ID, HttpErrorResponse } from '@internal/http';
import { ArgumentsHost, Catch, ForbiddenException, HttpStatus, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { of } from 'rxjs';

import { DomainErrorCode } from '@/domain/common';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(ForbiddenExceptionFilter.name);

  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const res = context.getResponse<Response>();

    this.logger.debug('Unauthorized exception caught ' + exception.message);

    const code = DomainErrorCode.INSUFFICIENT_SCOPE.value;
    const status = HttpStatus.UNAUTHORIZED;
    const response = new HttpErrorResponse(
      status,
      code,
      DomainErrorCode.INSUFFICIENT_SCOPE.description,
      this.getRequestId(req),
    );

    res.status(response.status).json(response);
    return of(response);
  }

  private getRequestId(req: Request): string {
    return req.headers[HEADER_REQUEST_ID] as string;
  }
}
