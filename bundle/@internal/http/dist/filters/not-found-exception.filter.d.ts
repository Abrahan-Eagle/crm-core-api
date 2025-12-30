import { ArgumentsHost, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { HttpErrorResponse } from '../dtos';
export declare class NotFoundExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: NotFoundException, host: ArgumentsHost): import("rxjs").Observable<HttpErrorResponse>;
    private getRequestId;
}
