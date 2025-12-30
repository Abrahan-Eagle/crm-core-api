"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optional = void 0;
const errors_1 = require("../errors");
const result_1 = require("./result");
class Optional {
    constructor(value, invalidTypes = [], allowedInvalidTypes = [], valueTrace = '') {
        this.valueTrace = valueTrace;
        this.invalidTypes = new Set();
        this.allowedInvalidTypes = new Set();
        this.invalidTypes = new Set(invalidTypes);
        this.allowedInvalidTypes = new Set(allowedInvalidTypes);
        if (this.isTypeInvalid(value)) {
            throw new errors_1.InvalidValueException(this.valueTrace, 'Optional received an invalid value');
        }
        this.value = value;
    }
    traced(value, ...path) {
        return new Optional(value, [...this.invalidTypes], [...this.allowedInvalidTypes], [this.valueTrace, ...path].join('.'));
    }
    static of(value) {
        const disallow = ['null', 'undefined'];
        return new Optional(value, disallow);
    }
    static ofNullable(value) {
        const typeConfig = ['null'];
        return new Optional(value, typeConfig, typeConfig);
    }
    static ofUndefinable(value) {
        const typeConfig = ['null', 'undefined'];
        return new Optional(value, typeConfig, typeConfig);
    }
    static empty() {
        const typeConfig = ['null', 'undefined'];
        return new Optional(undefined, typeConfig, typeConfig);
    }
    toString() {
        let stringValue = '.empty';
        if (this.value !== undefined && this.value !== null) {
            stringValue = `[${this.valueTrace}][${Object(this.value).toString()}]`;
        }
        return `Optional${stringValue}`;
    }
    isPresent() {
        const valueType = this.value === null ? 'null' : typeof this.value;
        return !this.invalidTypes.has(valueType);
    }
    validate(mapError) {
        if (!this.isPresent())
            return mapError(this.value);
        return result_1.Result.ok(this.getOrThrow());
    }
    ifPresent(action) {
        if (this.isPresent()) {
            action(this.getOrThrow());
        }
    }
    ifPresentOrElse(action, emptyAction) {
        if (this.isPresent()) {
            return action(this.getOrThrow());
        }
        return emptyAction();
    }
    validateIfPresent(action) {
        if (this.isPresent()) {
            return action(this.getOrThrow());
        }
        return result_1.Result.ok();
    }
    orElse(other) {
        return this.isPresent() ? this.getOrThrow() : other;
    }
    orElseGet(supplier) {
        return this.isPresent() ? this.getOrThrow() : supplier();
    }
    orElseThrow(error) {
        if (!this.isPresent()) {
            throw error;
        }
        return this.getOrThrow();
    }
    getOrThrow() {
        if (!this.isPresent()) {
            throw new errors_1.InvalidValueException(this.valueTrace, 'Tried to get a value from an empty Optional');
        }
        return this.value;
    }
    filter(predicate) {
        if (this.isPresent() && predicate(this.getOrThrow())) {
            return this;
        }
        return this.traced(undefined);
    }
    map(mapper) {
        if (!this.isPresent()) {
            return this.traced(undefined);
        }
        const value = mapper(this.getOrThrow(), this);
        if (this.isTypeInvalid(value)) {
            return this.traced(undefined);
        }
        return this.mapToOptional(value);
    }
    toResult() {
        return result_1.Result.ok(this.value);
    }
    replaceIfEmpty(value) {
        if (!this.isPresent()) {
            return Optional.ofUndefinable(value);
        }
        return this;
    }
    getFromObject(key) {
        if (!this.isPresent())
            return this.traced(undefined, key.toString());
        return this.mapToOptional(this.getOrThrow()[key], key);
    }
    getFromObjectOrThrow(key) {
        const optional = this.getFromObject(key);
        return optional.getOrThrow();
    }
    mapToOptional(value, key) {
        if (key)
            return this.traced(value, key.toString());
        const invalidTypes = Array.from(this.invalidTypes.values());
        const allowedInvalidTypes = Array.from(this.allowedInvalidTypes.values());
        return new Optional(value, invalidTypes, allowedInvalidTypes);
    }
    flatMap(mapper) {
        if (!this.isPresent()) {
            return this.traced(undefined);
        }
        const value = mapper(this.getOrThrow());
        if (this.isTypeInvalid(value)) {
            return this.traced(undefined);
        }
        return value;
    }
    isTypeInvalid(value) {
        const valueType = String(value);
        const isInvalidType = this.invalidTypes.has(valueType);
        const isNotWhiteListed = !this.allowedInvalidTypes.has(valueType);
        return isInvalidType && isNotWhiteListed;
    }
}
exports.Optional = Optional;
//# sourceMappingURL=optional.js.map