"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotFoundExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const dtos_1 = require("../dtos");
let NotFoundExceptionFilter = NotFoundExceptionFilter_1 = class NotFoundExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(NotFoundExceptionFilter_1.name);
    }
    catch(exception, host) {
        const context = host.switchToHttp();
        const req = context.getRequest();
        const res = context.getResponse();
        this.logger.debug(`Not Found Exception: ${exception.message}`);
        const { NOT_FOUND } = common_2.DomainErrorCode;
        const code = NOT_FOUND.value;
        const status = exception.getStatus() || common_1.HttpStatus.NOT_FOUND;
        const response = new dtos_1.HttpErrorResponse(status, code, exception.message, this.getRequestId(req));
        res.status(response.status).json(response);
        return (0, rxjs_1.of)(response);
    }
    getRequestId(req) {
        return req.headers[config_1.HEADER_REQUEST_ID];
    }
};
exports.NotFoundExceptionFilter = NotFoundExceptionFilter;
exports.NotFoundExceptionFilter = NotFoundExceptionFilter = NotFoundExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.NotFoundException)
], NotFoundExceptionFilter);
//# sourceMappingURL=not-found-exception.filter.js.map