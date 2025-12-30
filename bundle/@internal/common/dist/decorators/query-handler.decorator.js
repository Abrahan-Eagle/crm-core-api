"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandler = void 0;
const messages_1 = require("../messages");
const QueryHandler = (...messages) => {
    return (target) => {
        if (!messages_1.BaseQueryHandler.isPrototypeOf(target)) {
            throw new Error(`QueryHandler decorator can only be used on classes that extend BaseQueryHandler`);
        }
        messages.forEach((message) => messages_1.MessageHandlerRepository.registerQueryHandler(message, target));
    };
};
exports.QueryHandler = QueryHandler;
//# sourceMappingURL=query-handler.decorator.js.map