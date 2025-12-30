import { Optional } from '@internal/common';
export declare class TopicConfig {
    readonly topic: string;
    readonly messages: MessageConfig[];
    readonly subscriptions: SubscriptionConfig[];
    constructor(topic: string, messages: MessageConfig[], subscriptions: SubscriptionConfig[]);
    static createFromOptional(config: Optional<Partial<TopicConfig>>): TopicConfig;
}
export declare class SubscriptionConfig {
    readonly key: string;
    readonly subscription: string;
    constructor(key: string, subscription: string);
    static createFromOptional(config: Optional<Partial<SubscriptionConfig>>): SubscriptionConfig;
}
export declare class MessageConfig {
    readonly key: string;
    readonly message: string;
    constructor(key: string, message: string);
    static createFromOptional(config: Optional<Partial<MessageConfig>>): MessageConfig;
}
