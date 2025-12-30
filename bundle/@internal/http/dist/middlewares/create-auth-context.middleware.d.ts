import { Optional } from '@internal/common';
import { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AuthContextStorage, AuthContextStore } from '../context-storages';
export declare class CreateAuthContextMiddleware implements NestMiddleware {
    private readonly context;
    protected readonly defaultClaimPath = "auth.payload";
    constructor(context: AuthContextStorage);
    use(req: Request, _: Response, next: NextFunction): void;
    protected getContext(req: Request & {
        auth?: any;
    }): AuthContextStore | undefined;
    protected getClaim<T = string>(req: Request, claim: string): Optional<T>;
}
