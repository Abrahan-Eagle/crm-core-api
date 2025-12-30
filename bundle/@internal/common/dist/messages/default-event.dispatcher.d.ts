import { ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { EventDispatcher, Events } from '../messages';
import { MessageHandlerRepository } from './message-handler.repository';
export declare class DefaultEventDispatcher implements EventDispatcher {
    private readonly repository;
    private readonly moduleRef;
    private readonly logger;
    constructor(repository: MessageHandlerRepository, moduleRef: ModuleRef);
    dispatchEventsAsync(...events: Events[]): void;
    dispatchEvents(...events: Events[]): Observable<void>;
    private getObservables;
    private getHandlersFor;
}
