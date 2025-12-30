import { DomainError, DomainErrorCode } from '../errors';
export type JavascriptRepresentation = string;
export type InvalidType = JavascriptRepresentation | 'null' | 'undefined';
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type OptionalValue<T> = Undefinable<T> | Nullable<T>;
export type DomainErrorMapper = (code: DomainErrorCode) => DomainError;
export type NullishValuesFrom<T> = Extract<T, OptionalValue<never>>;
export type MapErrorFunction<T> = (value?: T) => DomainError | DomainErrorCode;
export type OptionalProperties<T extends object, OtherStringTypes = never> = T extends Array<infer U> ? U extends object ? OptionalProperties<U, OtherStringTypes>[] : OptionalValue<U>[] : OptionalDictionary<T, OtherStringTypes>;
export type OptionalDictionary<T extends object, OtherStringTypes = never> = Pick<{
    -readonly [P in keyof T]?: NonNullable<T[P]> extends OtherStringTypes | object ? OptionalStringOrValue<NonNullable<T[P]>, OtherStringTypes> : OptionalValue<T[P]>;
}, {
    [P in keyof T]: T[P] extends Function ? never : P;
}[keyof T]>;
export type OptionalStringOrValue<T extends object, OtherStringTypes = never> = T extends Date ? OptionalValue<Date | string> : T extends OtherStringTypes ? OptionalValue<string> : OptionalProperties<T, OtherStringTypes>;
export type ExtractPrefixed<T, U extends string, CamelCase extends boolean> = {
    [K in keyof T as K extends `${U}${infer R}` ? (CamelCase extends true ? `${Uncapitalize<R>}` : `${R}`) : never]: T[K];
};
export type Type<T = any> = Function & {
    prototype: T;
};
export type ConstructableType<T = any> = Function & {
    prototype: T;
} & {
    new (...args: any[]): T;
};
export type InstanceOf<T> = T extends Type<infer U> ? U : never;
