"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
const errors_1 = require("../errors");
const result_1 = require("./result");
const validator_1 = require("./validator");
class Phone {
    constructor(intlPrefix, regionCode, number) {
        this.intlPrefix = intlPrefix;
        this.regionCode = regionCode;
        this.number = number;
    }
    toString() {
        return `${this.intlPrefix}${this.number}`;
    }
    equals(phone) {
        return this.intlPrefix === phone.intlPrefix && this.regionCode === phone.regionCode && this.number === phone.number;
    }
    static create(intlPrefix, regionCode, number) {
        return result_1.Result.combine([
            Phone.validateIntlPrefix(intlPrefix),
            Phone.validateRegionCode(regionCode),
            Phone.validateNumber(number),
        ]).map(([intlPrefix, regionCode, number]) => new Phone(intlPrefix, regionCode, number));
    }
    static validateIntlPrefix(intlPrefix) {
        return validator_1.Validator.of(intlPrefix)
            .required(() => errors_1.DomainErrorCode.PHONE_INTL_PREFIX_EMPTY)
            .numericString(() => new errors_1.BadRequest(errors_1.DomainErrorCode.PHONE_INTL_PREFIX_INVALID));
    }
    static validateRegionCode(regionCode) {
        return validator_1.Validator.of(regionCode)
            .required(() => errors_1.DomainErrorCode.PHONE_REGION_CODE_EMPTY)
            .countryCode2(() => new errors_1.BadRequest(errors_1.DomainErrorCode.PHONE_REGION_CODE_INVALID));
    }
    static validateNumber(number) {
        return validator_1.Validator.of(number)
            .required(() => errors_1.DomainErrorCode.PHONE_NUMBER_EMPTY)
            .phone(() => new errors_1.BadRequest(errors_1.DomainErrorCode.PHONE_NUMBER_INVALID));
    }
}
exports.Phone = Phone;
//# sourceMappingURL=phone.js.map