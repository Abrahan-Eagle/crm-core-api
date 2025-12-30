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
var CreateRequestContextMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRequestContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config");
const context_storages_1 = require("../context-storages");
let CreateRequestContextMiddleware = CreateRequestContextMiddleware_1 = class CreateRequestContextMiddleware {
    constructor(context) {
        this.context = context;
    }
    use(req, _, next) {
        this.context.run(CreateRequestContextMiddleware_1.getRequestMetadata(req), () => next());
    }
    static getRequestMetadata(req) {
        const requestId = req.headers[config_1.HEADER_REQUEST_ID];
        const headers = structuredClone(req.headers);
        delete headers[config_1.HEADER_REQUEST_ID];
        delete headers.authorization;
        return { requestId, path: req.originalUrl, method: req.method, protocol: req.protocol, headers };
    }
};
exports.CreateRequestContextMiddleware = CreateRequestContextMiddleware;
exports.CreateRequestContextMiddleware = CreateRequestContextMiddleware = CreateRequestContextMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [context_storages_1.RequestContextStorage])
], CreateRequestContextMiddleware);
//# sourceMappingURL=create-request-context.middleware.js.map