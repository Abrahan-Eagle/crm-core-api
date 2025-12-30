import { Observable } from 'rxjs';
export declare function attachOnSubscribe<T>(obs: Observable<T>, fn: (done: () => void, obs?: Observable<T>) => any): Observable<T>;
