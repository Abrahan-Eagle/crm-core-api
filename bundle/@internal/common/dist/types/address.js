"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = exports.MAX_COUNTRY_ISO_CODE_LENGTH = exports.MAX_ZIP_CODE_LENGTH = exports.MAX_ADDRESS_LENGTH = void 0;
const errors_1 = require("../errors");
const result_1 = require("./result");
const validator_1 = require("./validator");
exports.MAX_ADDRESS_LENGTH = 255;
exports.MAX_ZIP_CODE_LENGTH = 15;
exports.MAX_COUNTRY_ISO_CODE_LENGTH = 2;
class Address {
    constructor(addressLine1, addressLine2, state, city, zipCode, countryIsoCode2) {
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.state = state;
        this.city = city;
        this.zipCode = zipCode;
        this.countryIsoCode2 = countryIsoCode2;
    }
    static create(line1, line2, state, city, zipCode, countryIsoCode2) {
        return result_1.Result.combine([
            Address.validateLine1(line1),
            Address.validateLine2(line2),
            Address.validateState(state),
            Address.validateCity(city),
            Address.validateZipCode(zipCode),
            Address.validateCountryIsoCode2(countryIsoCode2),
        ]).map((args) => new Address(...args));
    }
    static validateLine1(line1) {
        return validator_1.Validator.of(line1)
            .string(() => errors_1.DomainErrorCode.ADDRESS_LINE_1_INVALID)
            .maxLength(exports.MAX_ADDRESS_LENGTH, () => errors_1.DomainErrorCode.ADDRESS_LINE_1_INVALID)
            .orNull();
    }
    static validateLine2(line2) {
        return validator_1.Validator.of(line2)
            .string(() => errors_1.DomainErrorCode.ADDRESS_LINE_2_INVALID)
            .maxLength(exports.MAX_ADDRESS_LENGTH, () => errors_1.DomainErrorCode.ADDRESS_LINE_2_INVALID)
            .orNull();
    }
    static validateState(state) {
        return validator_1.Validator.of(state)
            .string(() => errors_1.DomainErrorCode.STATE_INVALID)
            .maxLength(exports.MAX_ADDRESS_LENGTH, () => errors_1.DomainErrorCode.STATE_INVALID)
            .orNull();
    }
    static validateCity(city) {
        return validator_1.Validator.of(city)
            .string(() => errors_1.DomainErrorCode.CITY_INVALID)
            .maxLength(exports.MAX_ADDRESS_LENGTH, () => errors_1.DomainErrorCode.CITY_INVALID)
            .orNull();
    }
    static validateZipCode(zipCode) {
        return validator_1.Validator.of(zipCode)
            .string(() => errors_1.DomainErrorCode.ZIP_CODE_INVALID)
            .maxLength(exports.MAX_ZIP_CODE_LENGTH, () => errors_1.DomainErrorCode.ZIP_CODE_INVALID)
            .orNull();
    }
    static validateCountryIsoCode2(countryIsoCode2) {
        return validator_1.Validator.of(countryIsoCode2)
            .required(() => errors_1.DomainErrorCode.COUNTRY_ISO_CODE_EMPTY)
            .countryCode2(() => errors_1.DomainErrorCode.COUNTRY_ISO_CODE_INVALID)
            .maxLength(exports.MAX_COUNTRY_ISO_CODE_LENGTH, () => errors_1.DomainErrorCode.COUNTRY_ISO_CODE_INVALID);
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map