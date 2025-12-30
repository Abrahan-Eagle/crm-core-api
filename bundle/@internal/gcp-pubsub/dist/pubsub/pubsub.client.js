"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PubSubClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubClient = exports.ConfigProvider = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
exports.ConfigProvider = 'PUBSUB_CLIENT_CONFIG';
let PubSubClient = PubSubClient_1 = class PubSubClient extends microservices_1.ClientProxy {
    constructor(clientConfig) {
        super();
        this.clientConfig = clientConfig;
        this.topics = new Map();
        this.logger = new common_1.Logger(PubSubClient_1.name);
    }
    async connect() {
        return (this.pubsubClient ??= new pubsub_1.PubSub(this.clientConfig));
    }
    async close() {
        const closingTopics = Array.from(this.topics.values()).map((topic) => topic.flush());
        await Promise.all(closingTopics);
        await this.pubsubClient.close();
    }
    async dispatchEvent(packet) {
        const { topic, data, message, attributes = {} } = this.serialize(packet);
        return await this.getTopic(topic)
            .publishMessage({ json: data, attributes: { ...attributes, message } })
            .catch((error) => {
            this.logger.error(error);
            throw error;
        });
    }
    publish(packet, callback) {
        throw new common_1.NotImplementedException('Use `dispatchEvent` instead.');
    }
    serialize(packet) {
        const { topic, message, attributes } = packet.pattern;
        return { data: packet.data, message, topic, attributes };
    }
    getTopic(topicName) {
        const cachedTopic = this.topics.get(topicName);
        if (cachedTopic)
            return cachedTopic;
        const topic = this.pubsubClient.topic(topicName);
        this.topics.set(topicName, topic);
        return topic;
    }
};
exports.PubSubClient = PubSubClient;
exports.PubSubClient = PubSubClient = PubSubClient_1 = __decorate([
    __param(0, (0, common_1.Inject)(exports.ConfigProvider)),
    __metadata("design:paramtypes", [Object])
], PubSubClient);
//# sourceMappingURL=pubsub.client.js.map