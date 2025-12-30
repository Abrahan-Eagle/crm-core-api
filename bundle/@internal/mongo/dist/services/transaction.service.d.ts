import { Observable } from 'rxjs';
export interface TransactionService {
    runInTransaction<T>(action: () => Observable<T>): Observable<T>;
}
