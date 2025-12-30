import { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { RequestContextStorage, RequestContextStore } from '../context-storages';
export declare class CreateRequestContextMiddleware implements NestMiddleware {
    private readonly context;
    constructor(context: RequestContextStorage);
    use(req: Request, _: Response, next: NextFunction): void;
    static getRequestMetadata(req: Request): RequestContextStore;
}
