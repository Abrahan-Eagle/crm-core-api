import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpErrorResponse } from '../dtos';
export declare class DefaultExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: HttpException, host: ArgumentsHost): import("rxjs").Observable<HttpErrorResponse>;
    private getRequestId;
}
