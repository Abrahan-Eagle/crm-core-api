export declare class HttpErrorResponse {
    readonly status: number;
    readonly code?: string | undefined;
    readonly message?: string | undefined;
    readonly requestId?: string | undefined;
    readonly data?: any;
    constructor(status: number, code?: string | undefined, message?: string | undefined, requestId?: string | undefined, data?: any);
    toJSON(): object;
}
