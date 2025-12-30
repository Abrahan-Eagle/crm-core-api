import { UnauthorizedUser } from '@internal/common';
import { ApiErrorCode, HEADER_REQUEST_ID, HttpErrorResponse } from '@internal/http';
import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { of } from 'rxjs';

@Catch(UnauthorizedError, UnauthorizedUser)
export class UnauthorizedExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: UnauthorizedError | UnauthorizedUser, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const res = context.getResponse<Response>();

    const message = exception.message;

    this.logger.debug('Unauthorized exception caught ' + message);
    const { UNAUTHORIZED } = ApiErrorCode;
    const code = UNAUTHORIZED.value;
    const status = HttpStatus.UNAUTHORIZED;
    const response = new HttpErrorResponse(status, code, message ?? UNAUTHORIZED.description, this.getRequestId(req));

    res.status(response.status).json(response);
    return of(response);
  }

  private getRequestId(req: Request): string {
    return req.headers[HEADER_REQUEST_ID] as string;
  }
}
