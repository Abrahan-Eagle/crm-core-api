import { Optional, OptionalProperties } from '@internal/common';
import { LimitConfig } from './limit.config';
export declare enum RateLimitRequestMethods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    ALL = "ALL",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD"
}
export declare class RateLimitConfig {
    readonly name: string;
    readonly path: RegExp;
    readonly method: RateLimitRequestMethods;
    readonly limits: LimitConfig[];
    protected constructor(name: string, path: RegExp, method: RateLimitRequestMethods, limits: LimitConfig[]);
    static load(optional: Optional<OptionalProperties<RateLimitConfig, RegExp>>): RateLimitConfig;
    static loadList(config: Optional<Record<string, any>>): RateLimitConfig[];
}
