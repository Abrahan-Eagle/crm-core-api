import { UnauthorizedUser } from '@internal/common';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpErrorResponse } from '../dtos';
export declare class UnauthorizedExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: UnauthorizedUser, host: ArgumentsHost): import("rxjs").Observable<HttpErrorResponse>;
    private getRequestId;
}
