import { Nullable, OptionalValue } from './custom-types';
import { Result } from './result';
export declare class Email {
    readonly value: string;
    readonly verified: boolean;
    readonly verifiedAt: Nullable<Date>;
    protected constructor(value: string, verified: boolean, verifiedAt: Nullable<Date>);
    equals(email: Email): boolean;
    static create(email: OptionalValue<string>, verified: OptionalValue<boolean>, verifiedAt: OptionalValue<Date | string>): Result<Email>;
    static createUnverified(email: OptionalValue<string>): Result<Email>;
    static validateEmail(email: OptionalValue<string>): Result<string>;
    static validateVerified(verified: OptionalValue<boolean>): Result<boolean>;
    static validateVerifiedAt(verifiedAt: OptionalValue<Date | string>): Result<Nullable<Date>>;
}
