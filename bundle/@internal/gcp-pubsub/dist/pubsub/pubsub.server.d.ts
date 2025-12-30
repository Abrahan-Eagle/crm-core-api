import { ClientConfig, PubSub, Subscription } from '@google-cloud/pubsub';
import { Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
export interface PubSubServerOptions {
    config: ClientConfig;
}
export type SubscriptionPattern = {
    subscription: string;
    topic?: string;
};
export declare const SubscriptionHandler: (pattern: SubscriptionPattern) => MethodDecorator;
export declare class PubSubServer extends Server implements CustomTransportStrategy {
    protected readonly options: PubSubServerOptions;
    protected readonly logger: Logger;
    protected client: PubSub;
    protected readonly clientConfig: ClientConfig;
    protected subscriptions: Subscription[];
    constructor(options: PubSubServerOptions);
    listen(callback: (...optionalParams: unknown[]) => any): Promise<void>;
    close(): Promise<void>;
    private registerSubscription;
}
