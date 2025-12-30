import { NestMiddleware } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { RateLimiterAbstract, RateLimiterRes } from 'rate-limiter-flexible';
import { RateLimitsConfig } from '../config';
export type RateLimiterResponse = {
    expression: string;
    rateLimiter: RateLimiterAbstract;
    response: RateLimiterRes;
};
export type RateLimiterOrErrorResponse = RateLimiterResponse & {
    response: RateLimiterRes | Error;
};
export declare class RateLimitMiddleware implements NestMiddleware {
    private readonly moduleRef;
    private readonly config;
    private readonly logger;
    constructor(moduleRef: ModuleRef, config: RateLimitsConfig);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    private getRateLimiter;
    private setHeaders;
}
