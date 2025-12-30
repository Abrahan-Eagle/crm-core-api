import { Nullable, OptionalValue } from './custom-types';
import { Result } from './result';
export declare const MAX_ADDRESS_LENGTH = 255;
export declare const MAX_ZIP_CODE_LENGTH = 15;
export declare const MAX_COUNTRY_ISO_CODE_LENGTH = 2;
export declare class Address {
    readonly addressLine1: Nullable<string>;
    readonly addressLine2: Nullable<string>;
    readonly state: Nullable<string>;
    readonly city: Nullable<string>;
    readonly zipCode: Nullable<string>;
    readonly countryIsoCode2: string;
    protected constructor(addressLine1: Nullable<string>, addressLine2: Nullable<string>, state: Nullable<string>, city: Nullable<string>, zipCode: Nullable<string>, countryIsoCode2: string);
    static create(line1: OptionalValue<string>, line2: OptionalValue<string>, state: OptionalValue<string>, city: OptionalValue<string>, zipCode: OptionalValue<string>, countryIsoCode2: OptionalValue<string>): Result<Address>;
    static validateLine1(line1: OptionalValue<string>): Result<Nullable<string>>;
    static validateLine2(line2: OptionalValue<string>): Result<Nullable<string>>;
    static validateState(state: OptionalValue<string>): Result<Nullable<string>>;
    static validateCity(city: OptionalValue<string>): Result<Nullable<string>>;
    static validateZipCode(zipCode: OptionalValue<string>): Result<Nullable<string>>;
    static validateCountryIsoCode2(countryIsoCode2: OptionalValue<string>): Result<string>;
}
