import { mergeMap, Observable } from 'rxjs';
import { DomainError } from '../../../errors';
export declare function validateIf<T, O extends T = T>(iif: (value: T) => value is O, mapError: (value: T) => DomainError): ReturnType<typeof mergeMap<T, Observable<O>>>;
export declare function validateIf<T>(iif: (value: T) => boolean, mapError: (value: T) => DomainError): ReturnType<typeof mergeMap<T, Observable<T>>>;
