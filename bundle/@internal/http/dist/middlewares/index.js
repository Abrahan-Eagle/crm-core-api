"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMiddlewares = void 0;
const create_auth_context_middleware_1 = require("./create-auth-context.middleware");
const create_request_context_middleware_1 = require("./create-request-context.middleware");
const router_logger_middleware_1 = require("./router-logger.middleware");
const set_request_id_middleware_1 = require("./set-request-id.middleware");
__exportStar(require("./create-auth-context.middleware"), exports);
__exportStar(require("./create-request-context.middleware"), exports);
__exportStar(require("./router-logger.middleware"), exports);
__exportStar(require("./set-request-id.middleware"), exports);
exports.HttpMiddlewares = [
    create_auth_context_middleware_1.CreateAuthContextMiddleware,
    create_request_context_middleware_1.CreateRequestContextMiddleware,
    router_logger_middleware_1.RouterLoggerMiddleware,
    set_request_id_middleware_1.SetRequestIdMiddleware,
];
//# sourceMappingURL=index.js.map