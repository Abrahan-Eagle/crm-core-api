"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequestIdMiddleware = exports.SetRequestIdMiddleware = void 0;
const common_1 = require("@internal/common");
const config_1 = require("../config");
class SetRequestIdMiddleware {
    use(req, _, next) {
        const prevVal = req.headers[config_1.HEADER_REQUEST_ID];
        req.headers[config_1.HEADER_REQUEST_ID] = prevVal === undefined ? common_1.UUID.generate().toString() : prevVal;
        next();
    }
}
exports.SetRequestIdMiddleware = SetRequestIdMiddleware;
exports.setRequestIdMiddleware = SetRequestIdMiddleware.prototype.use;
//# sourceMappingURL=set-request-id.middleware.js.map