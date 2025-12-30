"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TooManyRequestsExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const http_1 = require("@internal/http");
const rxjs_1 = require("rxjs");
const errors_1 = require("../errors");
let TooManyRequestsExceptionFilter = TooManyRequestsExceptionFilter_1 = class TooManyRequestsExceptionFilter extends microservices_1.BaseRpcExceptionFilter {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(TooManyRequestsExceptionFilter_1.name);
    }
    catch(exception, host) {
        this.logger.debug('Too many requests exception caught.');
        const context = host.switchToHttp();
        const req = context.getRequest();
        const res = context.getResponse();
        const { TOO_MANY_REQUESTS } = http_1.ApiErrorCode;
        const code = TOO_MANY_REQUESTS.value;
        const status = common_1.HttpStatus.TOO_MANY_REQUESTS;
        const message = exception.message;
        const response = new http_1.HttpErrorResponse(status, code, message, this.getRequestId(req));
        res.status(response.status).json(response);
        return (0, rxjs_1.of)(response);
    }
    getRequestId(req) {
        return req.headers[http_1.HEADER_REQUEST_ID];
    }
};
exports.TooManyRequestsExceptionFilter = TooManyRequestsExceptionFilter;
exports.TooManyRequestsExceptionFilter = TooManyRequestsExceptionFilter = TooManyRequestsExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(errors_1.TooManyRequestsException)
], TooManyRequestsExceptionFilter);
//# sourceMappingURL=too-many-requests-exception.filter.js.map