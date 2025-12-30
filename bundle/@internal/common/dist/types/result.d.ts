import { DomainError } from '../errors';
export type ResultValues<T> = {
    [P in keyof T]: T[P] extends Result<infer Type> ? Type : unknown;
};
export declare class Result<T> {
    readonly error: Error;
    protected readonly value: T;
    protected constructor(error?: Error, value?: T);
    static ok<U = void>(value?: U): Result<U>;
    static fail(error: Error): Failure;
    isFailure(): this is Failure;
    isSuccess(): this is Success<T>;
    validate(predicate: (val: T) => boolean, mapError: (value?: T) => DomainError): Result<T>;
    getOrThrow(): T;
    exceptionOrNull(): Error | null;
    flatMap<R>(transform: (value: T) => Result<R>): Result<R>;
    onSuccess(action: (value: T) => void): Result<T>;
    onFailure(action: (error: Error) => void): Result<T>;
    transformOnFailure<R>(transform: (value: Failure) => Result<R>): Result<R | T>;
    onBoth(action: (value: Result<T>) => void): Result<T>;
    map<R>(transform: (value: T) => R): Result<R>;
    static combine<T extends Array<Result<any>>>(results: [...T]): Result<ResultValues<T>>;
    static combine<T extends {
        [x: string | number | symbol]: Result<any>;
    }>(results: T): Result<ResultValues<T>>;
}
export declare class Failure extends Result<never> {
    protected constructor(error: Error);
    static of(error: Error): Failure;
}
export declare class Success<T> extends Result<T> {
    protected constructor(value?: T);
    static of<T>(value?: T): Success<T>;
}
