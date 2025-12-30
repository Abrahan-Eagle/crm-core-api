"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainErrorCode = exports.ErrorCode = void 0;
class ErrorCode {
    constructor(value, description) {
        this.value = value;
        this.description = description;
    }
    static of(value, description) {
        return new ErrorCode(value, description);
    }
    format(...args) {
        const regex = /{(\d+)}/g;
        const matches = this.description.match(regex) || [];
        const hasExactArgs = matches.length === args.length;
        if (!hasExactArgs) {
            const message = `Not exact arguments for error code: ${this.value}. Expected ${matches.length} but got ${args.length}.`;
            throw new Error(message);
        }
        return this.description.replace(regex, (match, i) => (typeof args[i] === 'undefined' ? match : args[i]));
    }
}
exports.ErrorCode = ErrorCode;
class DomainErrorCode extends (_b = ErrorCode) {
    constructor(value, description) {
        super(value, description);
    }
}
exports.DomainErrorCode = DomainErrorCode;
_a = DomainErrorCode;
DomainErrorCode.NOT_FOUND = Reflect.get(_b, "of", _a).call(_a, 'NOT_FOUND', '{0} not found for {1}.');
DomainErrorCode.UNAUTHORIZED_USER = Reflect.get(_b, "of", _a).call(_a, 'UNAUTHORIZED_USER', 'User is unauthorized.');
DomainErrorCode.MESSAGE_DUPLICATED = Reflect.get(_b, "of", _a).call(_a, 'MESSAGE_DUPLICATED', 'Message already stored.');
DomainErrorCode.EMAIL_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'EMAIL_EMPTY', 'Email is empty.');
DomainErrorCode.EMAIL_INVALID = Reflect.get(_b, "of", _a).call(_a, 'EMAIL_INVALID', 'Email is invalid.');
DomainErrorCode.EMAIL_VERIFIED_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'EMAIL_VERIFIED_EMPTY', 'Email verified is empty.');
DomainErrorCode.EMAIL_VERIFIED_INVALID = Reflect.get(_b, "of", _a).call(_a, 'EMAIL_VERIFIED_INVALID', 'Email verified is invalid.');
DomainErrorCode.EMAIL_VERIFIED_AT_INVALID = Reflect.get(_b, "of", _a).call(_a, 'EMAIL_VERIFIED_AT_INVALID', 'Email verified at is invalid.');
DomainErrorCode.EMAIL_VERIFIED_AT_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'EMAIL_VERIFIED_AT_EMPTY', 'Email verified at is empty.');
DomainErrorCode.PHONE_INTL_PREFIX_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'PHONE_INTL_PREFIX_EMPTY', 'Phone international prefix is empty.');
DomainErrorCode.PHONE_REGION_CODE_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'PHONE_REGION_CODE_EMPTY', 'Phone region code is empty.');
DomainErrorCode.PHONE_NUMBER_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'PHONE_NUMBER_EMPTY', 'Phone number is empty.');
DomainErrorCode.PHONE_INTL_PREFIX_INVALID = Reflect.get(_b, "of", _a).call(_a, 'PHONE_INTL_PREFIX_INVALID', 'Phone international prefix is invalid.');
DomainErrorCode.PHONE_REGION_CODE_INVALID = Reflect.get(_b, "of", _a).call(_a, 'PHONE_REGION_CODE_INVALID', 'Phone region code is invalid.');
DomainErrorCode.PHONE_NUMBER_INVALID = Reflect.get(_b, "of", _a).call(_a, 'PHONE_NUMBER_INVALID', 'Phone number is invalid.');
DomainErrorCode.ADDRESS_LINE_1_INVALID = Reflect.get(_b, "of", _a).call(_a, 'ADDRESS_LINE_1_INVALID', 'Address line 1 is invalid.');
DomainErrorCode.ADDRESS_LINE_2_INVALID = Reflect.get(_b, "of", _a).call(_a, 'ADDRESS_LINE_2_INVALID', 'Address line 2 is invalid.');
DomainErrorCode.STATE_INVALID = Reflect.get(_b, "of", _a).call(_a, 'STATE_INVALID', 'State is invalid.');
DomainErrorCode.CITY_INVALID = Reflect.get(_b, "of", _a).call(_a, 'CITY_INVALID', 'City is invalid.');
DomainErrorCode.ZIP_CODE_INVALID = Reflect.get(_b, "of", _a).call(_a, 'ZIP_CODE_INVALID', 'Zip code is invalid.');
DomainErrorCode.COUNTRY_ISO_CODE_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'COUNTRY_ISO_CODE_EMPTY', 'ISO Country code is empty.');
DomainErrorCode.COUNTRY_ISO_CODE_INVALID = Reflect.get(_b, "of", _a).call(_a, 'COUNTRY_ISO_CODE_INVALID', 'ISO Country code is invalid.');
DomainErrorCode.LAST_NAME_INVALID = Reflect.get(_b, "of", _a).call(_a, 'LAST_NAME_INVALID', 'Last name is invalid.');
DomainErrorCode.LAST_NAME_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'LAST_NAME_EMPTY', 'Last name is empty.');
DomainErrorCode.FIRST_NAME_LENGTH_INVALID = Reflect.get(_b, "of", _a).call(_a, 'FIRST_NAME_LENGTH_INVALID', 'First name length is invalid.');
DomainErrorCode.FIRST_NAME_INVALID = Reflect.get(_b, "of", _a).call(_a, 'FIRST_NAME_INVALID', 'First name is invalid.');
DomainErrorCode.FIRST_NAME_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'FIRST_NAME_EMPTY', 'First name is empty.');
DomainErrorCode.CREATED_AT_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'CREATED_AT_EMPTY', 'Created at date is empty.');
DomainErrorCode.CREATED_AT_INVALID = Reflect.get(_b, "of", _a).call(_a, 'CREATED_AT_INVALID', 'Created at date is invalid.');
DomainErrorCode.UPDATED_AT_INVALID = Reflect.get(_b, "of", _a).call(_a, 'UPDATED_AT_INVALID', 'Updated at date invalid.');
DomainErrorCode.USER_ID_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'USER_ID_EMPTY', 'User id is empty.');
DomainErrorCode.USER_ID_INVALID = Reflect.get(_b, "of", _a).call(_a, 'USER_ID_INVALID', 'User id is invalid.');
DomainErrorCode.PROVIDER_ID_EMPTY = Reflect.get(_b, "of", _a).call(_a, 'PROVIDER_ID_EMPTY', 'Provider id is empty.');
DomainErrorCode.PROVIDER_ID_INVALID = Reflect.get(_b, "of", _a).call(_a, 'PROVIDER_ID_INVALID', 'Provider id is invalid.');
//# sourceMappingURL=error-code.js.map