import { ErrorCode } from '@internal/common';
export declare class ApiErrorCode extends ErrorCode {
    static readonly INTERNAL_SERVER_ERROR: ErrorCode;
    static readonly GONE: ErrorCode;
    static readonly TOO_MANY_REQUESTS: ErrorCode;
    static readonly BAD_GATEWAY: ErrorCode;
    static readonly SERVICE_UNAVAILABLE: ErrorCode;
    static readonly UNAUTHORIZED: ErrorCode;
}
