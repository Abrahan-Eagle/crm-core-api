/// <reference types="node" />
import { AsyncLocalStorage } from 'node:async_hooks';
export interface AuthContextStore {
    readonly userId: string;
}
export declare class AuthContextStorage extends AsyncLocalStorage<AuthContextStore> {
    get store(): AuthContextStore;
}
