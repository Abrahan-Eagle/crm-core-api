import { DomainError } from '../../../errors';
export declare const throwIfVoid: <T>(mapError: () => DomainError) => import("rxjs").OperatorFunction<T, NonNullable<T>>;
