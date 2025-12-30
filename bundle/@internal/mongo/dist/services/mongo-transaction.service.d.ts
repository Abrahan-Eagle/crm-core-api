import { Connection } from 'mongoose';
import { Observable } from 'rxjs';
import { MongoTransactionContextStorage } from '../context-storages';
import { TransactionService } from './transaction.service';
export declare class MongoTransactionService implements TransactionService {
    private readonly connection;
    private readonly context;
    private readonly logger;
    constructor(connection: Connection, context: MongoTransactionContextStorage);
    runInTransaction<T>(action: () => Observable<T>): Observable<T>;
}
