"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimisticLockingException = exports.InvalidValueException = exports.DomainError = exports.DomainException = void 0;
class DomainException extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
        this.name = this.constructor.name;
    }
    is(code) {
        return this.code === code.value;
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            stack: this.stack,
        };
    }
}
exports.DomainException = DomainException;
class DomainError extends DomainException {
    constructor(code, message) {
        super(code, message);
    }
    static of(code, message) {
        return new DomainError(code, message);
    }
}
exports.DomainError = DomainError;
class InvalidValueException extends DomainException {
    constructor(value, message) {
        if (value === undefined || value === null) {
            value = typeof value;
        }
        if (message) {
            message = `${message} | `;
        }
        const valueString = JSON.stringify(value);
        super('INVALID_ARGUMENT_VALUE', `${message}Invalid value: ${valueString}`);
    }
}
exports.InvalidValueException = InvalidValueException;
class OptimisticLockingException extends DomainException {
    constructor(message) {
        message ??= 'Optimistic locking error';
        message ||= '[Empty message]';
        super('OPTIMISTIC_LOCKING', message);
    }
}
exports.OptimisticLockingException = OptimisticLockingException;
//# sourceMappingURL=domain-exception.js.map