"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsException = void 0;
const common_1 = require("@internal/common");
const error_codes_1 = require("./error-codes");
class TooManyRequestsException extends common_1.DomainException {
    constructor(message) {
        const { TOO_MANY_REQUESTS } = error_codes_1.RateLimitErrorCode;
        super(TOO_MANY_REQUESTS.value, message || TOO_MANY_REQUESTS.description);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
//# sourceMappingURL=errors.js.map