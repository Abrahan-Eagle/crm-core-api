"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextStorage = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const common_1 = require("@internal/common");
class RequestContextStorage extends node_async_hooks_1.AsyncLocalStorage {
    get store() {
        const store = this.getStore();
        if (!store) {
            throw new common_1.InvalidValueException('RequestContextStore', 'RequestContextStore is not defined');
        }
        return store;
    }
}
exports.RequestContextStorage = RequestContextStorage;
//# sourceMappingURL=request-context-storage.js.map