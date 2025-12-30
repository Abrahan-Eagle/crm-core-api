"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UnauthorizedExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const dtos_1 = require("../dtos");
const errors_1 = require("../errors");
let UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = class UnauthorizedExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(UnauthorizedExceptionFilter_1.name);
    }
    catch(exception, host) {
        const context = host.switchToHttp();
        const req = context.getRequest();
        const res = context.getResponse();
        const message = exception.message;
        this.logger.debug('Unathorized exception catched ' + message);
        const { UNAUTHORIZED } = errors_1.ApiErrorCode;
        const code = UNAUTHORIZED.value;
        const status = common_1.HttpStatus.UNAUTHORIZED;
        const response = new dtos_1.HttpErrorResponse(status, code, UNAUTHORIZED.description, this.getRequestId(req));
        res.status(response.status).json(response);
        return (0, rxjs_1.of)(response);
    }
    getRequestId(req) {
        return req.headers[config_1.HEADER_REQUEST_ID];
    }
};
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter;
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter = UnauthorizedExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_2.UnauthorizedUser)
], UnauthorizedExceptionFilter);
//# sourceMappingURL=unauthorized-exception.filter.js.map