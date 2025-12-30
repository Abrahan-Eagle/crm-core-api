import { AppConfig } from '@internal/common';
import { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
export declare class RouterLoggerMiddleware implements NestMiddleware {
    private readonly appConfig;
    private readonly logger;
    constructor(appConfig: AppConfig);
    use(req: Request, res: Response, next: NextFunction): void;
    private logRequest;
    private logResponse;
}
