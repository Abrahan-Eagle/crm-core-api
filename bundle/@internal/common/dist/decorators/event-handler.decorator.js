"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const messages_1 = require("../messages");
const EventHandler = (...messages) => {
    return (target) => {
        if (!messages_1.BaseEventHandler.isPrototypeOf(target)) {
            throw new Error(`EventHandler decorator can only be used on classes that extend BaseEventHandler`);
        }
        messages.forEach((message) => messages_1.MessageHandlerRepository.registerEventHandler(message, target));
    };
};
exports.EventHandler = EventHandler;
//# sourceMappingURL=event-handler.decorator.js.map