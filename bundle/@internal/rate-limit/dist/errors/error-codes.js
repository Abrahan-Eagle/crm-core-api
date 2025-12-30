"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitErrorCode = void 0;
const common_1 = require("@internal/common");
class RateLimitErrorCode extends (_b = common_1.DomainErrorCode) {
}
exports.RateLimitErrorCode = RateLimitErrorCode;
_a = RateLimitErrorCode;
RateLimitErrorCode.TOO_MANY_REQUESTS = Reflect.get(_b, "of", _a).call(_a, 'TOO_MANY_REQUESTS', 'Too many requests');
//# sourceMappingURL=error-codes.js.map