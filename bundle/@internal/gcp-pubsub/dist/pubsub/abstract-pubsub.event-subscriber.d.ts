import type { Message } from '@google-cloud/pubsub';
import { MessageDispatcher } from '@internal/common';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare abstract class AbstractPubSubEventSubscriber {
    protected readonly messageDispatcher: MessageDispatcher;
    protected readonly logger: Logger;
    constructor(messageDispatcher: MessageDispatcher);
    abstract handle(message: Message, ...args: any[]): Observable<void>;
    protected handleError(message: Message, error: Error): void;
    protected ok(message: Message): void;
}
