import type { Message } from '@google-cloud/pubsub';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventQueueContextStorage, EventQueueContextStore } from '../context-storages';
export declare class CreateEventQueueContextInterceptor implements NestInterceptor {
    private readonly context;
    constructor(context: EventQueueContextStorage);
    intercept(ec: ExecutionContext, next: CallHandler): Observable<any>;
    static createStore(ec: ExecutionContext, message: Message): EventQueueContextStore;
}
