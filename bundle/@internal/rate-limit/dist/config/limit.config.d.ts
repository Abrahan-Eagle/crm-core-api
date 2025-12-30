import { Optional, OptionalProperties } from '@internal/common';
export declare class LimitConfig {
    readonly name: string;
    readonly limit: number;
    readonly timeInSeconds: number;
    readonly countingExpression: string;
    readonly countingCondition?: RegExp | undefined;
    protected constructor(name: string, limit: number, timeInSeconds: number, countingExpression: string, countingCondition?: RegExp | undefined);
    getName(): string;
    static load(name: string, config: Optional<OptionalProperties<LimitConfig, RegExp>>): LimitConfig;
    static loadList(name: string, config: Optional<OptionalProperties<LimitConfig, RegExp>[]>): LimitConfig[];
}
