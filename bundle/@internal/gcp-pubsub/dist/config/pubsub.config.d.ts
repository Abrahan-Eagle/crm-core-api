import { Config, Optional } from '@internal/common';
import { PubSubServerOptions } from '../pubsub';
import { MessageKey, SubscriptionKey } from './constants';
import { TopicConfig } from './topic.config';
export interface MessageValue {
    readonly topic: string;
    readonly message: string;
}
export interface SubscriptionValue {
    readonly topic: string;
    readonly subscription: string;
}
export declare class PubSubConfig extends Config implements PubSubServerOptions {
    readonly config: PubSubServerOptions['config'];
    readonly topics: TopicConfig[];
    private readonly messages;
    private readonly subscriptions;
    protected constructor(config: PubSubServerOptions['config'], topics: TopicConfig[]);
    getMessage(key: MessageKey): MessageValue;
    getSubscription(key: SubscriptionKey): SubscriptionValue;
    static getMessage(key: MessageKey): MessageValue;
    static getSubscription(key: SubscriptionKey): SubscriptionValue;
    static load(config: Optional<Record<string, any>>): PubSubConfig;
}
