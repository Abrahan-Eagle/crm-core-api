import { Id, UUID } from '../types';
import { DomainError } from './domain-exception';
import { DomainErrorCode } from './error-code';
export declare class BadRequest extends DomainError {
    constructor(code: DomainErrorCode, ...args: unknown[]);
}
export declare class Conflict extends DomainError {
    constructor(code: DomainErrorCode, ...args: unknown[]);
}
export declare class NotFound extends DomainError {
    constructor(message: string, suffixCode?: string);
    static of(entity: string | {
        name: string;
    }, id: string | Id | UUID): NotFound;
    static ofEntity(entity: {
        name: string;
    }, id: string | Id | UUID): NotFound;
    private static getSuffixCode;
    isOfEntity(entity: {
        name: string;
    }): boolean;
}
export declare class UnauthorizedUser extends DomainError {
    constructor(message?: string);
}
