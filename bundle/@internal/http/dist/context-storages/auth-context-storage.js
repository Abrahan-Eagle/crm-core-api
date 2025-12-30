"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthContextStorage = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const common_1 = require("@internal/common");
class AuthContextStorage extends node_async_hooks_1.AsyncLocalStorage {
    get store() {
        const store = this.getStore();
        if (!store) {
            throw new common_1.InvalidValueException('AuthContextStore', 'AuthContextStore is not defined');
        }
        return store;
    }
}
exports.AuthContextStorage = AuthContextStorage;
//# sourceMappingURL=auth-context-storage.js.map