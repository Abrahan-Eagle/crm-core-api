import { DynamicModule, FactoryProvider } from '@nestjs/common';
import { RateLimiterAbstract } from 'rate-limiter-flexible';
import { LimitConfig } from '../config';
export type RateLimitProvider = Pick<FactoryProvider<RateLimiterAbstract>, 'inject' | 'useFactory'> & {
    config: LimitConfig;
};
export declare class RateLimitModule {
    static forRoot(providers: RateLimitProvider[]): DynamicModule;
}
