import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EmitOptions, PubSubClient } from './pubsub.client';
export declare class PubSubService implements OnModuleInit, OnModuleDestroy {
    protected readonly client: PubSubClient;
    constructor(client: PubSubClient);
    emit<T>(emitOptions: EmitOptions): Observable<T>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
