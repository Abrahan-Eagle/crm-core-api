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
var RouterLoggerMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
const create_request_context_middleware_1 = require("./create-request-context.middleware");
let RouterLoggerMiddleware = RouterLoggerMiddleware_1 = class RouterLoggerMiddleware {
    constructor(appConfig) {
        this.appConfig = appConfig;
        this.logger = new common_1.Logger(RouterLoggerMiddleware_1.name);
    }
    use(req, res, next) {
        this.logRequest(req);
        this.logResponse(req, res);
        return next();
    }
    logRequest(req) {
        const body = !this.appConfig.isProduction() ? req.body : undefined;
        this.logger.log({
            message: `Request ${req?.method} - ${req.path}`,
            request: {
                ...create_request_context_middleware_1.CreateRequestContextMiddleware.getRequestMetadata(req),
                remoteAddress: req.socket.remoteAddress,
                body,
            },
        });
    }
    logResponse(req, res) {
        let body;
        if (!this.appConfig.isProduction()) {
            const oldJson = res.json.bind(res);
            res.json = (data = '(empty body)') => {
                body = data;
                return oldJson(data);
            };
        }
        res.on('finish', () => {
            this.logger.log({
                message: `Response ${req.method} - ${req.path}`,
                response: { statusCode: res.statusCode, headers: res.getHeaders(), body },
            });
        });
    }
};
exports.RouterLoggerMiddleware = RouterLoggerMiddleware;
exports.RouterLoggerMiddleware = RouterLoggerMiddleware = RouterLoggerMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_2.AppConfig])
], RouterLoggerMiddleware);
//# sourceMappingURL=router-logger.middleware.js.map