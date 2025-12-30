"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DefaultExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const dtos_1 = require("../dtos");
const errors_1 = require("../errors");
let DefaultExceptionFilter = DefaultExceptionFilter_1 = class DefaultExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(DefaultExceptionFilter_1.name);
    }
    catch(exception, host) {
        const context = host.switchToHttp();
        const req = context.getRequest();
        const res = context.getResponse();
        const requestId = this.getRequestId(req);
        const message = `[Exception-Name: ${exception.name || 'UNKNOWN'}][HTTP-Route: ${req?.route?.path || 'NONE'}][Request-Id: ${requestId}]`;
        this.logger.error(message, exception?.stack || exception);
        const { INTERNAL_SERVER_ERROR } = errors_1.ApiErrorCode;
        const error = exception?.getResponse?.()?.error || INTERNAL_SERVER_ERROR.value;
        const code = error.toLocaleUpperCase().replace(/\s/gi, '_');
        const status = exception?.getStatus?.() || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const response = new dtos_1.HttpErrorResponse(status, code, INTERNAL_SERVER_ERROR.description, requestId);
        res.status(response.status).json(response);
        return (0, rxjs_1.of)(response);
    }
    getRequestId(req) {
        return req.headers[config_1.HEADER_REQUEST_ID];
    }
};
exports.DefaultExceptionFilter = DefaultExceptionFilter;
exports.DefaultExceptionFilter = DefaultExceptionFilter = DefaultExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], DefaultExceptionFilter);
//# sourceMappingURL=default-exception.filter.js.map