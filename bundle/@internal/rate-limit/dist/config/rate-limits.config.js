"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitsConfig = void 0;
const common_1 = require("@internal/common");
const rate_limit_config_1 = require("./rate-limit.config");
class RateLimitsConfig extends common_1.Config {
    constructor(rateLimits) {
        super();
        this.rateLimits = rateLimits;
    }
    static load(config) {
        return new RateLimitsConfig(rate_limit_config_1.RateLimitConfig.loadList(config));
    }
}
exports.RateLimitsConfig = RateLimitsConfig;
//# sourceMappingURL=rate-limits.config.js.map