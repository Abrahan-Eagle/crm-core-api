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
var CreateEventQueueContextInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventQueueContextInterceptor = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/microservices/constants");
const common_2 = require("@internal/common");
const context_storages_1 = require("../context-storages");
let CreateEventQueueContextInterceptor = CreateEventQueueContextInterceptor_1 = class CreateEventQueueContextInterceptor {
    constructor(context) {
        this.context = context;
    }
    intercept(ec, next) {
        const message = ec.switchToRpc().getData();
        return (0, common_2.attachOnSubscribe)(next.handle(), (done) => {
            this.context.run(CreateEventQueueContextInterceptor_1.createStore(ec, message), () => done());
        });
    }
    static createStore(ec, message) {
        const attributes = structuredClone(message.attributes ?? {});
        const requestId = attributes.request_id;
        const messageName = attributes.message;
        const [pattern] = Reflect.getMetadata(constants_1.PATTERN_METADATA, ec.getHandler());
        return {
            requestId,
            message: { id: message.id, name: messageName, attributes },
            subscriber: { topic: pattern.topic, subscription: pattern.subscription },
        };
    }
};
exports.CreateEventQueueContextInterceptor = CreateEventQueueContextInterceptor;
exports.CreateEventQueueContextInterceptor = CreateEventQueueContextInterceptor = CreateEventQueueContextInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [context_storages_1.EventQueueContextStorage])
], CreateEventQueueContextInterceptor);
//# sourceMappingURL=create-event-queue-context.interceptor.js.map