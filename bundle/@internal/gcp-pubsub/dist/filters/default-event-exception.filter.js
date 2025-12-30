"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DefaultEventExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultEventExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let DefaultEventExceptionFilter = DefaultEventExceptionFilter_1 = class DefaultEventExceptionFilter extends microservices_1.BaseRpcExceptionFilter {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(DefaultEventExceptionFilter_1.name);
    }
    catch(exception, _) {
        const logMessage = `[Exception-Name: ${exception.name || 'UNKNOWN'}] ${exception.message}`;
        this.logger.error({
            message: logMessage,
            stack: exception?.stack || exception,
        });
        return (0, rxjs_1.of)(exception);
    }
};
exports.DefaultEventExceptionFilter = DefaultEventExceptionFilter;
exports.DefaultEventExceptionFilter = DefaultEventExceptionFilter = DefaultEventExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], DefaultEventExceptionFilter);
//# sourceMappingURL=default-event-exception.filter.js.map