/// <reference types="node" />
import { AsyncLocalStorage } from 'node:async_hooks';
import { ClientSession } from 'mongoose';
export interface MongoTransactionStore {
    session: ClientSession;
}
export declare class MongoTransactionContextStorage extends AsyncLocalStorage<MongoTransactionStore> {
}
