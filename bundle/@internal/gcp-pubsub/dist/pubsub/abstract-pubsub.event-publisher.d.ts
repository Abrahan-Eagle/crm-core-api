/// <reference types="node" />
import { BaseEventHandler, IEvent, ObjectMapper } from '@internal/common';
import { Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Observable } from 'rxjs';
import { MessageValue } from '../config';
import { RequestContextStore } from '../context-storages';
import { EmitOptions } from './pubsub.client';
import { PubSubService } from './pubsub.service';
export declare abstract class AbstractPubSubEventPublisher<T extends IEvent, M extends object> extends BaseEventHandler<T> {
    protected readonly pubsubService: PubSubService;
    protected readonly messageValue: MessageValue;
    protected readonly logger: Logger;
    protected readonly requestContexts: AsyncLocalStorage<RequestContextStore>[];
    protected readonly mapper?: ObjectMapper<M>;
    protected constructor(pubsubService: PubSubService, messageValue: MessageValue, ...requestContexts: AsyncLocalStorage<RequestContextStore>[]);
    protected constructor(pubsubService: PubSubService, messageValue: MessageValue, mapper: ObjectMapper<M>, ...requestContexts: AsyncLocalStorage<RequestContextStore>[]);
    handle(event: T): Observable<void>;
    protected mapMessage(event: T): M;
    protected emitMessage<T>(options: Omit<EmitOptions, 'topic' | 'message'>): Observable<T>;
    protected getAttributes(emitOptions: Omit<EmitOptions, 'topic' | 'message'>): Record<string, string>;
    protected getRequestId(): string | undefined;
}
