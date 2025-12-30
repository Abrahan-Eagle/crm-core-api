"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubContext = void 0;
const microservices_1 = require("@nestjs/microservices");
class PubSubContext extends microservices_1.BaseRpcContext {
    constructor(args) {
        super(args);
    }
}
exports.PubSubContext = PubSubContext;
//# sourceMappingURL=pubsub.context.js.map