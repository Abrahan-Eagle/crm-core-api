/// <reference types="node" />
import { AsyncLocalStorage } from 'node:async_hooks';
export interface RequestContextStore {
    readonly requestId: string;
    readonly path?: string;
    readonly method?: string;
    readonly protocol?: string;
    readonly headers?: Record<string, string | string[] | undefined>;
}
export declare class RequestContextStorage extends AsyncLocalStorage<RequestContextStore> {
    get store(): RequestContextStore;
}
