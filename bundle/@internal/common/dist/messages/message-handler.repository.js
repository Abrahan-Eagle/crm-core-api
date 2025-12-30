"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessageHandlerRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandlerRepository = void 0;
const common_1 = require("@nestjs/common");
let MessageHandlerRepository = MessageHandlerRepository_1 = class MessageHandlerRepository {
    getFirstHandler(handledMessage, metadataKey = MessageHandlerRepository_1.metadataKeys.default) {
        const handler = Array.from(MessageHandlerRepository_1.allHandlers.values()).find((handler) => {
            return Reflect.getMetadata(metadataKey, handler)?.has(handledMessage.constructor);
        });
        if (!handler)
            throw new Error(`${metadataKey.description} not found for message ${handledMessage.constructor.name}`);
        return handler;
    }
    getHandlers(handledMessage, metadataKey = MessageHandlerRepository_1.metadataKeys.default) {
        const handlers = Array.from(MessageHandlerRepository_1.allHandlers.values()).filter((handler) => {
            return Reflect.getMetadata(metadataKey, handler)?.has(handledMessage.constructor);
        });
        if (!handlers.length)
            throw new Error(`${metadataKey.description}s not found for message ${handledMessage.constructor.name}`);
        return handlers;
    }
    static registerHandler(params) {
        const { message, handler, addToSet, metadataKey } = params;
        this.allHandlers.add(handler);
        addToSet?.add(handler);
        const defaultMessageList = Reflect.getMetadata(this.metadataKeys.default, handler) ?? new Set();
        defaultMessageList.add(message);
        Reflect.defineMetadata(this.metadataKeys.default, defaultMessageList, handler);
        if (metadataKey) {
            const messageList = Reflect.getMetadata(metadataKey, handler) ?? new Set();
            messageList.add(message);
            Reflect.defineMetadata(metadataKey, messageList, handler);
        }
    }
    static registerCommandHandler(message, handler) {
        this.registerHandler({ message, handler, metadataKey: this.metadataKeys.command, addToSet: this.commandHandlers });
    }
    static registerQueryHandler(message, handler) {
        this.registerHandler({ message, handler, metadataKey: this.metadataKeys.query, addToSet: this.queryHandlers });
    }
    static registerEventHandler(message, handler) {
        this.registerHandler({ message, handler, metadataKey: this.metadataKeys.event, addToSet: this.eventHandlers });
    }
};
exports.MessageHandlerRepository = MessageHandlerRepository;
MessageHandlerRepository.metadataKeys = {
    command: Symbol('CommandHandler'),
    query: Symbol('QueryHandler'),
    event: Symbol('EventHandler'),
    default: Symbol('Handler'),
};
MessageHandlerRepository.allHandlers = new Set();
MessageHandlerRepository.commandHandlers = new Set();
MessageHandlerRepository.queryHandlers = new Set();
MessageHandlerRepository.eventHandlers = new Set();
exports.MessageHandlerRepository = MessageHandlerRepository = MessageHandlerRepository_1 = __decorate([
    (0, common_1.Injectable)()
], MessageHandlerRepository);
//# sourceMappingURL=message-handler.repository.js.map