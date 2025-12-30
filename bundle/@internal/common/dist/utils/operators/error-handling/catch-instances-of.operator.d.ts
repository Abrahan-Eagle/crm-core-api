import { Observable } from 'rxjs';
import { InstanceOf, Type } from '../../../types';
export declare function catchInstanceOf<T extends Type<Error>, Out, In>(errorClass: T | T[], handleError: (error: InstanceOf<T>) => Observable<Out> | Out): import("rxjs").OperatorFunction<In, Out | In>;
