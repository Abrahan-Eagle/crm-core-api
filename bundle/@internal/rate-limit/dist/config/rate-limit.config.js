"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitConfig = exports.RateLimitRequestMethods = void 0;
const common_1 = require("@internal/common");
const limit_config_1 = require("./limit.config");
var RateLimitRequestMethods;
(function (RateLimitRequestMethods) {
    RateLimitRequestMethods["GET"] = "GET";
    RateLimitRequestMethods["POST"] = "POST";
    RateLimitRequestMethods["PUT"] = "PUT";
    RateLimitRequestMethods["DELETE"] = "DELETE";
    RateLimitRequestMethods["PATCH"] = "PATCH";
    RateLimitRequestMethods["ALL"] = "ALL";
    RateLimitRequestMethods["OPTIONS"] = "OPTIONS";
    RateLimitRequestMethods["HEAD"] = "HEAD";
})(RateLimitRequestMethods || (exports.RateLimitRequestMethods = RateLimitRequestMethods = {}));
class RateLimitConfig {
    constructor(name, path, method, limits) {
        this.name = name;
        this.path = path;
        this.method = method;
        this.limits = limits;
    }
    static load(optional) {
        const name = optional.getFromObjectOrThrow('name');
        return new RateLimitConfig(name, new RegExp(optional.getFromObjectOrThrow('path')), common_1.Validator.of(optional.getFromObjectOrThrow('method'))
            .enum(RateLimitRequestMethods, (value) => {
            const message = `Invalid method, valid methods are: ${Object.values(RateLimitRequestMethods)}`;
            return new common_1.InvalidValueException(value, message);
        })
            .getOrThrow(), limit_config_1.LimitConfig.loadList(name, optional.getFromObject('limits')));
    }
    static loadList(config) {
        const rateLimits = config
            .getFromObject('rateLimits')
            .filter((rateLimit) => Array.isArray(rateLimit));
        const rateLimitConfigs = rateLimits
            .map((rateLimits, optional) => rateLimits.map((rateLimit, index) => RateLimitConfig.load(optional.traced(rateLimit, index))))
            .getOrThrow();
        return common_1.Validator.of(rateLimitConfigs)
            .unique((rateLimit) => rateLimit.name, () => new common_1.InvalidValueException(rateLimits.valueTrace, 'Rate Limit config name should be unique'))
            .getOrThrow();
    }
}
exports.RateLimitConfig = RateLimitConfig;
//# sourceMappingURL=rate-limit.config.js.map