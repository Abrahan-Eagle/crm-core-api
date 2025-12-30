"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageConfig = exports.SubscriptionConfig = exports.TopicConfig = void 0;
class TopicConfig {
    constructor(topic, messages, subscriptions) {
        this.topic = topic;
        this.messages = messages;
        this.subscriptions = subscriptions;
    }
    static createFromOptional(config) {
        return new TopicConfig(config.getFromObjectOrThrow('topic'), config
            .getFromObject('messages')
            .map((messages, parent) => messages.map((message, index) => MessageConfig.createFromOptional(parent.traced(message, index))))
            .getOrThrow(), config
            .getFromObject('subscriptions')
            .map((subs, parent) => subs.map((sub, index) => SubscriptionConfig.createFromOptional(parent.traced(sub, index))))
            .getOrThrow());
    }
}
exports.TopicConfig = TopicConfig;
class SubscriptionConfig {
    constructor(key, subscription) {
        this.key = key;
        this.subscription = subscription;
    }
    static createFromOptional(config) {
        return new SubscriptionConfig(config.getFromObjectOrThrow('key'), config.getFromObjectOrThrow('subscription'));
    }
}
exports.SubscriptionConfig = SubscriptionConfig;
class MessageConfig {
    constructor(key, message) {
        this.key = key;
        this.message = message;
    }
    static createFromOptional(config) {
        return new MessageConfig(config.getFromObjectOrThrow('key'), config.getFromObjectOrThrow('message'));
    }
}
exports.MessageConfig = MessageConfig;
//# sourceMappingURL=topic.config.js.map