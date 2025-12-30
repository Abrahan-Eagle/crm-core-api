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
var DefaultEventDispatcher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultEventDispatcher = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const message_handler_repository_1 = require("./message-handler.repository");
let DefaultEventDispatcher = DefaultEventDispatcher_1 = class DefaultEventDispatcher {
    constructor(repository, moduleRef) {
        this.repository = repository;
        this.moduleRef = moduleRef;
        this.logger = new common_1.Logger(DefaultEventDispatcher_1.name);
    }
    dispatchEventsAsync(...events) {
        const handleError = (error) => {
            const message = (error instanceof errors_1.DomainError ? `[Code: ${error.code}] ` : '') + error.message;
            this.logger.error(message, error?.stack || error);
            return (0, rxjs_1.of)(void 0);
        };
        (0, rxjs_1.of)(...this.getObservables(...events))
            .pipe((0, rxjs_1.mergeMap)((observable) => observable.pipe((0, rxjs_1.catchError)(handleError))))
            .subscribe();
    }
    dispatchEvents(...events) {
        return (0, rxjs_1.zip)(this.getObservables(...events)).pipe((0, utils_1.mapToVoid)());
    }
    getObservables(...events) {
        return events
            .flat()
            .map((event) => {
            return this.getHandlersFor(event).pipe((0, rxjs_1.tap)((handlers) => {
                if (!handlers.length)
                    return (0, rxjs_1.throwError)(() => new errors_1.InvalidValueException(event.constructor.name, 'No event handlers found'));
            }), (0, rxjs_1.mergeMap)((handlers) => (0, rxjs_1.zip)(handlers.map((handler) => handler.handle(event)))), (0, utils_1.mapToVoid)());
        })
            .flat();
    }
    getHandlersFor(event) {
        return (0, rxjs_1.of)(event).pipe((0, rxjs_1.mergeMap)((event) => {
            return (0, rxjs_1.zip)(this.repository
                .getHandlers(event, message_handler_repository_1.MessageHandlerRepository.metadataKeys.event)
                .map((handler) => this.moduleRef.resolve(handler, undefined, { strict: false })));
        }));
    }
};
exports.DefaultEventDispatcher = DefaultEventDispatcher;
exports.DefaultEventDispatcher = DefaultEventDispatcher = DefaultEventDispatcher_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_handler_repository_1.MessageHandlerRepository,
        core_1.ModuleRef])
], DefaultEventDispatcher);
//# sourceMappingURL=default-event.dispatcher.js.map