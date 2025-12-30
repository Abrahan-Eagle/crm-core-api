"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Success = exports.Failure = exports.Result = void 0;
const errors_1 = require("../errors");
class Result {
    constructor(error, value) {
        const hasError = error !== undefined;
        const hasValue = value !== undefined;
        if (hasError && hasValue) {
            throw new errors_1.InvalidValueException([error, value], 'Cannot create a result with an error and a value');
        }
        if (hasError) {
            this.error = error;
        }
        if (hasValue) {
            this.value = value;
        }
    }
    static ok(value) {
        return Success.of(value);
    }
    static fail(error) {
        return Failure.of(error);
    }
    isFailure() {
        return Boolean(this.error);
    }
    isSuccess() {
        return !this.isFailure();
    }
    validate(predicate, mapError) {
        if (this.isFailure() || predicate(this.getOrThrow()))
            return this;
        return Result.fail(mapError(this.getOrThrow()));
    }
    getOrThrow() {
        if (this.isFailure()) {
            throw this.error;
        }
        return this.value;
    }
    exceptionOrNull() {
        if (this.isFailure())
            return this.error;
        return null;
    }
    flatMap(transform) {
        if (this.isSuccess())
            return transform(this.value);
        return this;
    }
    onSuccess(action) {
        if (this.isSuccess())
            action(this.value);
        return this;
    }
    onFailure(action) {
        if (this.isFailure())
            action(this.error);
        return this;
    }
    transformOnFailure(transform) {
        if (this.isFailure())
            return transform(this);
        return this;
    }
    onBoth(action) {
        action(this);
        return this;
    }
    map(transform) {
        if (this.isSuccess())
            return Result.ok(transform(this.value));
        return this;
    }
    static combine(results) {
        const newResults = (Array.isArray(results) ? [] : {});
        for (const key in results) {
            const result = results[key];
            if (result.isFailure())
                return result;
            newResults[key] = result.value;
        }
        return Result.ok(newResults);
    }
}
exports.Result = Result;
class Failure extends Result {
    constructor(error) {
        super(error);
    }
    static of(error) {
        return new Failure(error);
    }
}
exports.Failure = Failure;
class Success extends Result {
    constructor(value) {
        super(undefined, value);
    }
    static of(value) {
        return new Success(value);
    }
}
exports.Success = Success;
//# sourceMappingURL=result.js.map