import { ClassTransformOptions } from 'class-transformer';
import { Type } from '../types';
export type Serializable = {
    toJSON: () => Record<string, unknown>;
};
export interface Transformer<T> {
    transform(value: T): void;
}
export declare class ObjectMapper<T> {
    private readonly responseClass;
    private readonly transformers;
    private readonly options;
    constructor(responseClass: Type<T>, transformers?: Transformer<T>[], options?: ClassTransformOptions);
    map(data: unknown[], options?: ClassTransformOptions): (T & Serializable)[];
    map(data: unknown, options?: ClassTransformOptions): T & Serializable;
    private transform;
}
