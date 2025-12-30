"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const moment_1 = __importDefault(require("moment"));
const validator_1 = __importDefault(require("validator"));
const config_1 = require("../config");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const optional_1 = require("./optional");
const result_1 = require("./result");
const defaultErrorMapper = (code) => new errors_1.BadRequest(code);
const defaultAfterOrBeforeDateOptions = {
    inclusive: false,
    checkTime: true,
};
class Validator extends result_1.Result {
    constructor(error, value, errorMapper = defaultErrorMapper) {
        super(error, value);
        this.errorMapper = errorMapper;
    }
    static of(value, errorMapper = defaultErrorMapper) {
        if (value instanceof result_1.Result)
            return Validator.fromResult(value, errorMapper);
        if (value instanceof optional_1.Optional)
            return Validator.fromResult(value.toResult(), errorMapper);
        return new Validator(undefined, value, errorMapper);
    }
    static fromResult(result, errorMapper) {
        const error = result.exceptionOrNull() || undefined;
        const value = result.isSuccess() ? result.getOrThrow() : undefined;
        return new Validator(error, value, errorMapper);
    }
    mapErrorWrapper(fn) {
        return (value) => {
            const errorOrCode = fn(value);
            if (errorOrCode instanceof Error)
                return errorOrCode;
            return this.errorMapper(errorOrCode);
        };
    }
    isPresent() {
        return this.isSuccess() && !config_1.NULLISH_VALUES.includes(this.getOrThrow());
    }
    map(mapper) {
        return Validator.of(super.map(mapper), this.errorMapper);
    }
    mapIfPresent(mapper) {
        if (!this.isPresent())
            return this;
        return Validator.of(super.map(mapper), this.errorMapper);
    }
    mapIfAbsent(mapper) {
        if (this.isPresent())
            return this;
        return Validator.of(super.map(mapper), this.errorMapper);
    }
    orNull() {
        if (this.isPresent())
            return this;
        return Validator.of(null, this.errorMapper);
    }
    validate(predicate, mapError) {
        const result = super.validate((value) => !this.isPresent() || predicate(value), this.mapErrorWrapper(mapError));
        return Validator.of(result, this.errorMapper);
    }
    required(mapError) {
        const result = super.validate(() => this.isPresent(), this.mapErrorWrapper(mapError));
        return Validator.of(result, this.errorMapper);
    }
    string(mapError) {
        return this.validate((value) => typeof value === 'string' || value instanceof String, (value) => mapError(value));
    }
    objectId(mapError) {
        return this.string(mapError).validate((value) => /^[a-fA-F0-9]{24}$/.test(value), (value) => mapError(value));
    }
    uuid(mapError) {
        return this.string(mapError).validate((value) => validator_1.default.isUUID(value), (value) => mapError(value));
    }
    numericString(mapError) {
        return this.string(mapError).validate((value) => validator_1.default.isNumeric(value), (value) => mapError(value));
    }
    countryCode2(mapError) {
        return this.string(mapError).validate((value) => validator_1.default.isISO31661Alpha2(value), (value) => mapError(value));
    }
    number(mapError) {
        return this.validate((value) => this.isNumber(value), (value) => mapError(value)).mapIfPresent((value) => Number(value));
    }
    minLength(minLength, mapError) {
        return this.validate((value) => this.hasLength(value) && value.length >= minLength, (value) => mapError(value));
    }
    maxLength(maxLength, mapError) {
        return this.validate((value) => this.hasLength(value) && value.length <= maxLength, (value) => mapError(value));
    }
    length(length, mapError) {
        return this.validate((value) => this.hasLength(value) && value.length == length, (value) => mapError(value));
    }
    min(min, mapError) {
        return this.number(mapError).validate((value) => value >= min, (value) => mapError(value));
    }
    range(min, max, mapError) {
        return this.number(mapError).validate((value) => value >= min && value <= max, (value) => mapError(value));
    }
    max(max, mapError) {
        return this.number(mapError).validate((value) => value <= max, (value) => mapError(value));
    }
    regex(regex, mapError) {
        return this.string(mapError).validate((value) => regex.test(value), (value) => mapError(value));
    }
    date(mapError) {
        const getDateString = (value) => (value instanceof Date ? (0, utils_1.formatDate)(value) : String(value));
        return this.validate((value) => validator_1.default.isDate(getDateString(value)), (value) => mapError(value)).mapIfPresent((value) => new Date(String(value)));
    }
    time(mapError, validPatterns = ['HH:mm:ss', 'HH:mm:ssZ', 'HH:mm:ss.SSS', 'HH:mm:ss.SSSZ']) {
        return this.validate((value) => (0, moment_1.default)(String(value), validPatterns, true).isValid(), mapError);
    }
    datetime(mapError) {
        const getDateString = (value) => (value instanceof Date ? value.toISOString() : String(value));
        return this.validate((value) => validator_1.default.isISO8601(getDateString(value), { strict: true, strictSeparator: true }), (value) => mapError(value)).mapIfPresent((value) => (value ? new Date(String(value)) : value));
    }
    afterDate(date, mapError, options) {
        const mergedOptions = { ...defaultAfterOrBeforeDateOptions, ...(options || {}) };
        return this.validate((value) => {
            if (!(value instanceof Date))
                return false;
            if (!mergedOptions.checkTime) {
                value = new Date((0, utils_1.formatDate)(value));
                date = new Date((0, utils_1.formatDate)(date));
            }
            if (mergedOptions.inclusive)
                return value.getTime() >= date.getTime();
            return value.getTime() > date.getTime();
        }, (value) => mapError(value));
    }
    beforeDate(date, mapError, options) {
        const mergedOptions = { ...defaultAfterOrBeforeDateOptions, ...(options || {}) };
        return this.validate((value) => {
            if (!(value instanceof Date))
                return false;
            if (!mergedOptions.checkTime) {
                value = new Date((0, utils_1.formatDate)(value));
                date = new Date((0, utils_1.formatDate)(date));
            }
            if (mergedOptions.inclusive)
                return value.getTime() <= date.getTime();
            return value.getTime() < date.getTime();
        }, (value) => mapError(value));
    }
    url(mapError) {
        return this.validate((value) => validator_1.default.isURL(String(value)), (value) => mapError(value));
    }
    email(mapError) {
        return this.validate((value) => validator_1.default.isEmail(String(value)), (value) => mapError(value));
    }
    phone(mapError) {
        return this.validate((value) => validator_1.default.isMobilePhone(String(value)), (value) => mapError(value));
    }
    enum(enumObject, mapError) {
        return this.validate((value) => Object.values(enumObject).includes(value), (value) => mapError(value));
    }
    boolean(mapError) {
        return this.validate((value) => typeof value === 'boolean', (value) => mapError(value));
    }
    array(mapError) {
        return this.validate((value) => Array.isArray(value), (value) => mapError(value));
    }
    notEmpty(mapError, emptyLength = 1) {
        return this.minLength(emptyLength, mapError);
    }
    unique(predicate, mapError, options) {
        const mergedOptions = { ...{ ignoreNullishValues: false }, ...(options || {}) };
        return this.array(mapError).validate((value) => {
            const values = value
                .map(predicate)
                .filter((v) => (mergedOptions.ignoreNullishValues ? !config_1.NULLISH_VALUES.includes(v) : true));
            return values.length === new Set(values).size;
        }, (value) => mapError(value));
    }
    object(mapError) {
        return this.validate((value) => typeof value === 'object' && !Array.isArray(value) && value !== null, (value) => mapError(value));
    }
    hasLength(value) {
        return value?.hasOwnProperty('length');
    }
    isNumber(value) {
        return !isNaN(parseFloat(value)) && !isNaN(Number(value));
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map