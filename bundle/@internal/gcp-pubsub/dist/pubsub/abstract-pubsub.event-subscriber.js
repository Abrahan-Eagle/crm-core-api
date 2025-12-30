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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPubSubEventSubscriber = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
const filters_1 = require("../filters");
const interceptors_1 = require("../interceptors");
let AbstractPubSubEventSubscriber = class AbstractPubSubEventSubscriber {
    constructor(messageDispatcher) {
        this.messageDispatcher = messageDispatcher;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    handleError(message, error) {
        const messageId = message?.id;
        const messageName = message?.attributes?.message;
        const errorCode = error instanceof common_2.DomainError ? `[Code: ${error.code}] ` : '';
        const errorMessage = `${errorCode}Unexpected error occurred. [Message-Id: ${messageId}][Message: ${messageName}]`;
        this.logger.error(errorMessage, error?.stack || error);
        message.nack();
    }
    ok(message) {
        const messageId = message?.id;
        const messageName = message?.attributes?.message;
        this.logger.log(`Message processed successfully. [Message-Id: ${messageId}][Message: ${messageName}]`);
        message.ack();
    }
};
exports.AbstractPubSubEventSubscriber = AbstractPubSubEventSubscriber;
exports.AbstractPubSubEventSubscriber = AbstractPubSubEventSubscriber = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.UseInterceptors)(interceptors_1.CreateEventQueueContextInterceptor),
    (0, common_1.UseFilters)(filters_1.DefaultEventExceptionFilter),
    __param(0, (0, common_1.Inject)("MessageDispatcher")),
    __metadata("design:paramtypes", [Object])
], AbstractPubSubEventSubscriber);
//# sourceMappingURL=abstract-pubsub.event-subscriber.js.map