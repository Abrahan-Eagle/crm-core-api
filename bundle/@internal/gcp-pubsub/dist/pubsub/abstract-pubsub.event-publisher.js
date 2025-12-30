"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPubSubEventPublisher = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
const rxjs_1 = require("rxjs");
class AbstractPubSubEventPublisher extends common_2.BaseEventHandler {
    constructor(pubsubService, messageValue, mapper, ...requestContexts) {
        super();
        this.pubsubService = pubsubService;
        this.messageValue = messageValue;
        this.requestContexts = [];
        if (mapper instanceof node_async_hooks_1.AsyncLocalStorage)
            this.requestContexts.push(mapper);
        else
            this.mapper = mapper;
        this.requestContexts.push(...requestContexts);
        this.logger = new common_1.Logger(this.constructor.name);
    }
    handle(event) {
        return (0, rxjs_1.of)(event).pipe((0, rxjs_1.map)((event) => this.mapMessage(event)), (0, rxjs_1.mergeMap)((data) => this.emitMessage({ data })), (0, rxjs_1.tap)(() => this.logger.log(`${this.messageValue.topic}:${this.messageValue.message} message emitted to pubsub`)), (0, common_2.mapToVoid)());
    }
    mapMessage(event) {
        if (!this.mapper)
            throw new Error('Mapper is not defined and mapMessage method is not implemented');
        return this.mapper.map(event);
    }
    emitMessage(options) {
        return (0, rxjs_1.of)(options).pipe((0, rxjs_1.mergeMap)((options) => {
            const { topic, message } = this.messageValue;
            const attributes = this.getAttributes(options);
            const request_id = this.getRequestId();
            if (request_id)
                attributes.request_id = request_id;
            return this.pubsubService.emit({ ...options, topic, message, attributes });
        }));
    }
    getAttributes(emitOptions) {
        return structuredClone(emitOptions.attributes ?? {});
    }
    getRequestId() {
        const context = this.requestContexts.find((context) => context.getStore());
        return context?.getStore()?.requestId;
    }
}
exports.AbstractPubSubEventPublisher = AbstractPubSubEventPublisher;
//# sourceMappingURL=abstract-pubsub.event-publisher.js.map