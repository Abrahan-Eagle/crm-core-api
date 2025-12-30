import { MapErrorFunction, OptionalValue, Type } from './custom-types';
import { Validator } from './validator';
export declare class Id {
    private readonly value;
    private static readonly EMPTY;
    protected constructor(value: string);
    static load<T extends Id>(this: Type<T>, value: string): T;
    static empty<T extends Id>(this: Type<T>): T;
    static create<T extends Id = Id>(this: Type<T>, value: OptionalValue<string>, emptyError: MapErrorFunction<string>, invalidError: MapErrorFunction<string>): Validator<T>;
    protected static validate(validator: Validator<string>, invalidError: MapErrorFunction<string>): Validator<string>;
    equals(anotherId: Id): boolean;
    toString(): string;
    isEmpty(): boolean;
    isPresent(): boolean;
}
