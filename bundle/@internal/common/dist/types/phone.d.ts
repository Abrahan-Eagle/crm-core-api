import { OptionalValue } from './custom-types';
import { Result } from './result';
export declare class Phone {
    readonly intlPrefix: string;
    readonly regionCode: string;
    readonly number: string;
    protected constructor(intlPrefix: string, regionCode: string, number: string);
    toString(): string;
    equals(phone: Phone): boolean;
    static create(intlPrefix: OptionalValue<string>, regionCode: OptionalValue<string>, number: OptionalValue<string>): Result<Phone>;
    static validateIntlPrefix(intlPrefix: OptionalValue<string>): Result<string>;
    static validateRegionCode(regionCode: OptionalValue<string>): Result<string>;
    static validateNumber(number: OptionalValue<string>): Result<string>;
}
