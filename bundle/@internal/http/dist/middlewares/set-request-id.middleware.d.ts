import { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
export declare class SetRequestIdMiddleware implements NestMiddleware {
    use(req: Request, _: Response, next: NextFunction): void;
}
export declare const setRequestIdMiddleware: (req: Request, _: Response, next: NextFunction) => void;
