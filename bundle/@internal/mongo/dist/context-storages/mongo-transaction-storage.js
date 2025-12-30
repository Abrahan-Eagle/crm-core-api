"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTransactionContextStorage = void 0;
const node_async_hooks_1 = require("node:async_hooks");
class MongoTransactionContextStorage extends node_async_hooks_1.AsyncLocalStorage {
}
exports.MongoTransactionContextStorage = MongoTransactionContextStorage;
//# sourceMappingURL=mongo-transaction-storage.js.map