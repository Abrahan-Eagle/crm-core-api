import { Transformer } from '../mappers';
export declare class NonNullishTransformer implements Transformer<object> {
    transform(value: object): void;
    tryNestedTransform(value: NonNullable<unknown>): void;
}
