import { ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
export declare class DefaultEventExceptionFilter extends BaseRpcExceptionFilter {
    private readonly logger;
    catch(exception: Error, _: ArgumentsHost): import("rxjs").Observable<Error>;
}
