"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const messages_1 = require("../messages");
const CommandHandler = (...messages) => {
    return (target) => {
        if (!messages_1.BaseCommandHandler.isPrototypeOf(target)) {
            throw new Error(`CommandHandler decorator can only be used on classes that extend BaseCommandHandler`);
        }
        messages.forEach((message) => messages_1.MessageHandlerRepository.registerCommandHandler(message, target));
    };
};
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=command-handler.decorator.js.map