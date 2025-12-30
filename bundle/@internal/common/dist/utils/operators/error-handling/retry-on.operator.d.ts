import { InstanceOf, Type } from '../../../types';
export declare function retryOn<T extends Type<Error>[]>(params: {
    instancesOf: [...T];
    maxAttempts: number;
    minBackoff: number;
    filter?: (error: InstanceOf<T[number]>) => boolean;
}): <T_1>(source: import("rxjs").Observable<T_1>) => import("rxjs").Observable<T_1>;
