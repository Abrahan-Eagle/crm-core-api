"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Id = void 0;
const validator_1 = require("./validator");
class Id {
    constructor(value) {
        this.value = value;
    }
    static load(value) {
        return new this(value);
    }
    static empty() {
        return this.EMPTY;
    }
    static create(value, emptyError, invalidError) {
        return this
            .validate(validator_1.Validator.of(value).required(emptyError), invalidError)
            .notEmpty(emptyError)
            .map((id) => new this(id));
    }
    static validate(validator, invalidError) {
        return validator.numericString(invalidError);
    }
    equals(anotherId) {
        return this.toString() === anotherId.toString();
    }
    toString() {
        return this.value;
    }
    isEmpty() {
        return this === this.constructor.EMPTY;
    }
    isPresent() {
        return !this.isEmpty();
    }
}
exports.Id = Id;
_a = Id;
Id.EMPTY = new _a('');
//# sourceMappingURL=id.js.map