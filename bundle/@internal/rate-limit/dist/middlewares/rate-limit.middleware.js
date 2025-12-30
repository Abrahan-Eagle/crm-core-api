"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RateLimitMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("../config");
const errors_1 = require("../errors");
let RateLimitMiddleware = RateLimitMiddleware_1 = class RateLimitMiddleware {
    constructor(moduleRef, config) {
        this.moduleRef = moduleRef;
        this.config = config;
        this.logger = new common_1.Logger(RateLimitMiddleware_1.name);
    }
    async use(req, res, next) {
        const rateLimiters = this.config.rateLimits
            .filter((rateLimit) => rateLimit.path.test(req.path) && [config_1.RateLimitRequestMethods.ALL, req.method].includes(rateLimit.method))
            .map((rateLimit) => {
            const limitConfig = rateLimit.limits
                .map((limit) => {
                const expression = limit.countingExpression
                    .split('.')
                    .reduce((acc, key) => acc?.[key], req)
                    ?.toString();
                return { rateLimit, limit, expression };
            })
                .find(({ expression, limit: { countingCondition } }) => expression && (!countingCondition || countingCondition.test(expression)));
            if (!limitConfig)
                return null;
            const name = limitConfig.limit.getName();
            return { name, expression: limitConfig.expression, rateLimiter: this.getRateLimiter(name) };
        })
            .filter((rateLimiter) => Boolean(rateLimiter));
        if (!rateLimiters.length) {
            this.logger.debug('No rate limiters found for request', { path: req.path, method: req.method });
            return next();
        }
        this.logger.debug(`Processing request with ${rateLimiters.map((limit) => limit.name)}`);
        return await Promise.all(rateLimiters.map(({ expression, rateLimiter }) => rateLimiter
            .consume(expression)
            .then((response) => ({ expression, rateLimiter, response }))
            .catch((response) => Promise.reject({ expression, rateLimiter, response }))))
            .then((limitResponses) => {
            this.setHeaders(res, limitResponses[0]);
            return next();
        })
            .catch((limitResponse) => {
            if (limitResponse.response instanceof Error)
                return Promise.reject(limitResponse.response);
            this.setHeaders(res, limitResponse, {
                'Retry-After': new Date(Date.now() + limitResponse.response.msBeforeNext).toUTCString(),
            });
            return Promise.reject(new errors_1.TooManyRequestsException());
        });
    }
    getRateLimiter(name) {
        const rateLimiter = this.moduleRef.get(name, { strict: false });
        if (!rateLimiter)
            throw new Error(`Rate limiter not found for path ${name}`);
        return rateLimiter;
    }
    setHeaders(res, limitResponse, otherHeaders) {
        const headers = {
            ...otherHeaders,
            'X-RateLimit-Limit': limitResponse.rateLimiter.points,
            'X-RateLimit-Remaining': limitResponse.response.remainingPoints,
            'X-RateLimit-Reset': Math.floor(limitResponse.response.msBeforeNext / 1000),
        };
        res.set(headers);
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = RateLimitMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        config_1.RateLimitsConfig])
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map