"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ServiceUnavailableExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const dtos_1 = require("../dtos");
const errors_1 = require("../errors");
let ServiceUnavailableExceptionFilter = ServiceUnavailableExceptionFilter_1 = class ServiceUnavailableExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(ServiceUnavailableExceptionFilter_1.name);
    }
    catch(exception, host) {
        this.logger.debug('Service Unavailable Exception', exception);
        const context = host.switchToHttp();
        const req = context.getRequest();
        const res = context.getResponse();
        const { SERVICE_UNAVAILABLE } = errors_1.ApiErrorCode;
        const status = exception.getStatus() || common_1.HttpStatus.SERVICE_UNAVAILABLE;
        const exceptionResponse = exception.getResponse();
        const response = new dtos_1.HttpErrorResponse(status, SERVICE_UNAVAILABLE.value, SERVICE_UNAVAILABLE.description, this.getRequestId(req), exceptionResponse);
        res.status(status).json(response);
        return (0, rxjs_1.of)(response);
    }
    getRequestId(req) {
        return req.headers[config_1.HEADER_REQUEST_ID];
    }
};
exports.ServiceUnavailableExceptionFilter = ServiceUnavailableExceptionFilter;
exports.ServiceUnavailableExceptionFilter = ServiceUnavailableExceptionFilter = ServiceUnavailableExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.ServiceUnavailableException)
], ServiceUnavailableExceptionFilter);
//# sourceMappingURL=service-unavailable-exception.filter.js.map