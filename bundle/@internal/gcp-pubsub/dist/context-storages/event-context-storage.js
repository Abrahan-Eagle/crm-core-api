"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventQueueContextStorage = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const common_1 = require("@internal/common");
class EventQueueContextStorage extends node_async_hooks_1.AsyncLocalStorage {
    get store() {
        const store = this.getStore();
        if (!store) {
            throw new common_1.InvalidValueException('EventQueueContextStore', 'EventQueueContextStore is not defined');
        }
        return store;
    }
}
exports.EventQueueContextStorage = EventQueueContextStorage;
//# sourceMappingURL=event-context-storage.js.map