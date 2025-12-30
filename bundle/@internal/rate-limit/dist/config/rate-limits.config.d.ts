import { Config, Optional } from '@internal/common';
import { RateLimitConfig } from './rate-limit.config';
export declare class RateLimitsConfig extends Config {
    readonly rateLimits: RateLimitConfig[];
    protected constructor(rateLimits: RateLimitConfig[]);
    static load(config: Optional<Record<string, any>>): RateLimitsConfig;
}
