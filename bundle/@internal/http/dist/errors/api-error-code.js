"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorCode = void 0;
const common_1 = require("@internal/common");
class ApiErrorCode extends common_1.ErrorCode {
}
exports.ApiErrorCode = ApiErrorCode;
ApiErrorCode.INTERNAL_SERVER_ERROR = common_1.ErrorCode.of('INTERNAL_SERVER_ERROR', 'Something is broken. This is usually a temporary error, for example in a high load situation or if an endpoint is temporarily having issues.');
ApiErrorCode.GONE = common_1.ErrorCode.of('GONE', 'This resource is gone. Used to indicate that an API endpoint has been turned off.');
ApiErrorCode.TOO_MANY_REQUESTS = common_1.ErrorCode.of('TOO_MANY_REQUESTS', 'Returned when a request cannot be served due to the application’s rate limit having been exhausted for the resource.');
ApiErrorCode.BAD_GATEWAY = common_1.ErrorCode.of('BAD_GATEWAY', 'Service is down, or being upgraded.');
ApiErrorCode.SERVICE_UNAVAILABLE = common_1.ErrorCode.of('SERVICE_UNAVAILABLE', 'Our servers are up, but overloaded with requests. Try again later.');
ApiErrorCode.UNAUTHORIZED = common_1.ErrorCode.of('UNAUTHORIZED', 'Authentication credentials were missing or incorrect.');
//# sourceMappingURL=api-error-code.js.map