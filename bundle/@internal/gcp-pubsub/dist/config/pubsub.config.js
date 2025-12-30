"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubConfig = void 0;
const common_1 = require("@internal/common");
const topic_config_1 = require("./topic.config");
class PubSubConfig extends common_1.Config {
    constructor(config, topics) {
        super();
        this.config = config;
        this.topics = topics;
        this.messages = new Map();
        this.subscriptions = new Map();
    }
    getMessage(key) {
        if (this.messages.has(key))
            return this.messages.get(key);
        const topic = this.topics.find((topic) => topic.messages.some((m) => m.key === key));
        if (!topic)
            throw new common_1.InvalidValueException(key, `Message ${key} not found in any topic`);
        const message = topic.messages.find((m) => m.key === key);
        const data = { topic: topic.topic, message: message.message };
        this.messages.set(key, data);
        return data;
    }
    getSubscription(key) {
        if (this.subscriptions.has(key))
            return this.subscriptions.get(key);
        const topic = this.topics.find((topic) => topic.subscriptions.some((sub) => sub.key === key));
        if (!topic)
            throw new common_1.InvalidValueException(key, `Subscription ${key} not found in any topic`);
        const subscription = topic.subscriptions.find((sub) => sub.key === key);
        const data = { topic: topic.topic, subscription: subscription.subscription };
        this.subscriptions.set(key, data);
        return data;
    }
    static getMessage(key) {
        return this.getInstance().getMessage(key);
    }
    static getSubscription(key) {
        return this.getInstance().getSubscription(key);
    }
    static load(config) {
        const pubsub = config.getFromObject('cloud').getFromObject('gcp').getFromObject('pubsub');
        return new PubSubConfig(pubsub.getFromObject('config').orElse({}), pubsub
            .getFromObject('topics')
            .map((topics, parent) => topics.map((topic, index) => topic_config_1.TopicConfig.createFromOptional(parent.traced(topic, index))))
            .getOrThrow());
    }
}
exports.PubSubConfig = PubSubConfig;
//# sourceMappingURL=pubsub.config.js.map