import { DomainErrorCode } from './error-code';
export declare class DomainException extends Error {
    readonly code: string;
    readonly message: string;
    constructor(code: string, message: string);
    is(code: DomainErrorCode): boolean;
    toJSON(): object;
}
export declare class DomainError extends DomainException {
    protected constructor(code: string, message: string);
    static of(code: string, message: string): DomainError;
}
export declare class InvalidValueException extends DomainException {
    constructor(value: unknown, message?: string);
}
export declare class OptimisticLockingException extends DomainException {
    constructor(message?: string);
}
