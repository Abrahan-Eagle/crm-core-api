import { HttpErrorResponse } from '@internal/http';
import { ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { TooManyRequestsException } from '../errors';
export declare class TooManyRequestsExceptionFilter extends BaseRpcExceptionFilter {
    private readonly logger;
    catch(exception: TooManyRequestsException, host: ArgumentsHost): import("rxjs").Observable<HttpErrorResponse>;
    private getRequestId;
}
