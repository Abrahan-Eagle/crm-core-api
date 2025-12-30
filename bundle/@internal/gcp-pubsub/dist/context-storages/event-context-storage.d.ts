/// <reference types="node" />
import { AsyncLocalStorage } from 'node:async_hooks';
export interface RequestContextStore {
    readonly requestId: string;
}
export interface EventQueueContextStore extends RequestContextStore {
    readonly message: {
        readonly id: string;
        readonly name: string;
        readonly attributes: Record<string, string | string[] | undefined>;
    };
    readonly subscriber: {
        readonly topic?: string;
        readonly subscription: string;
    };
}
export declare class EventQueueContextStorage extends AsyncLocalStorage<EventQueueContextStore> {
    get store(): EventQueueContextStore;
}
