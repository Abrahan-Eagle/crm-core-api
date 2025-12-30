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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHttpResource = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@internal/common");
const config_1 = require("../config");
const context_storages_1 = require("../context-storages");
const dtos_1 = require("../dtos");
const errors_1 = require("../errors");
let AbstractHttpResource = class AbstractHttpResource {
    constructor(messageDispatcher, authContext) {
        this.messageDispatcher = messageDispatcher;
        this.authContext = authContext;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    handleError(req, res, error) {
        if (error instanceof common_2.NotFound) {
            return this.notFound(req, res, error);
        }
        if (error instanceof common_2.BadRequest) {
            return this.badRequest(req, res, error);
        }
        const requestId = this.getRequestId(req);
        const errorCode = error instanceof common_2.DomainError ? `[Code: ${error.code}] ` : '';
        const errorMessage = `${errorCode}Unexpected error occurred. [Request-Id: ${requestId}]`;
        this.logger.error(errorMessage, error?.stack || error);
        return this.internalServerError(req, res);
    }
    ok(res, body) {
        return res.status(common_1.HttpStatus.OK).json(body);
    }
    created(res, body) {
        return res.status(common_1.HttpStatus.CREATED).json(body);
    }
    noContent(res) {
        return res.status(common_1.HttpStatus.NO_CONTENT).send();
    }
    notModified(res) {
        return res.status(common_1.HttpStatus.NOT_MODIFIED).send();
    }
    unauthorized(req, res, error) {
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.UNAUTHORIZED, error.code, error.message, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    forbidden(req, res, error) {
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.FORBIDDEN, error.code, error.message, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    notFound(req, res, error) {
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.NOT_FOUND, error.code, error.message, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    conflict(req, res, error) {
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.CONFLICT, error.code, error.message, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    gone(req, res) {
        const code = errors_1.ApiErrorCode.GONE;
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.GONE, code.value, code.description, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    tooManyRequests(req, res) {
        const code = errors_1.ApiErrorCode.TOO_MANY_REQUESTS;
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.TOO_MANY_REQUESTS, code.value, code.description, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    badGateway(req, res) {
        const code = errors_1.ApiErrorCode.BAD_GATEWAY;
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.BAD_GATEWAY, code.value, code.description, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    serviceUnavailable(req, res) {
        const code = errors_1.ApiErrorCode.SERVICE_UNAVAILABLE;
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.SERVICE_UNAVAILABLE, code.value, code.description, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    internalServerError(req, res, error) {
        const code = errors_1.ApiErrorCode.INTERNAL_SERVER_ERROR;
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.INTERNAL_SERVER_ERROR, error?.code || code.value, error?.message || code.description, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    badRequest(req, res, error) {
        const response = new dtos_1.HttpErrorResponse(common_1.HttpStatus.BAD_REQUEST, error.code, error.message, this.getRequestId(req));
        return res.status(response.status).json(response);
    }
    getRequestId(req) {
        return req.headers[config_1.HEADER_REQUEST_ID];
    }
    getCurrentUserId() {
        return this.authContext.getStore()?.userId ?? null;
    }
};
exports.AbstractHttpResource = AbstractHttpResource;
exports.AbstractHttpResource = AbstractHttpResource = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("MessageDispatcher")),
    __metadata("design:paramtypes", [Object, context_storages_1.AuthContextStorage])
], AbstractHttpResource);
//# sourceMappingURL=abstract-http.resource.js.map