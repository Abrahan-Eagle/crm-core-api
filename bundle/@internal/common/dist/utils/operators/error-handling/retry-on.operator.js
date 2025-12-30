"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryOn = void 0;
const common_1 = require("@nestjs/common");
const backoff_rxjs_1 = require("backoff-rxjs");
function retryOn(params) {
    const logger = new common_1.Logger('RetryOperator');
    const { maxAttempts, minBackoff, instancesOf, filter = () => true } = params;
    const isRetry = (error) => instancesOf.some((type) => error instanceof type && filter(error));
    const shouldRetry = (error) => {
        const shouldRetry = isRetry(error);
        if (shouldRetry)
            logger.debug(`Retrying due to error [${error.message}]...\n${error.stack}`);
        return shouldRetry;
    };
    return (0, backoff_rxjs_1.retryBackoff)({ maxRetries: maxAttempts, initialInterval: minBackoff, shouldRetry });
}
exports.retryOn = retryOn;
//# sourceMappingURL=retry-on.operator.js.map