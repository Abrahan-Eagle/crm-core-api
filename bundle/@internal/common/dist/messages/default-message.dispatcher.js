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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMessageDispatcher = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const message_handler_repository_1 = require("./message-handler.repository");
let DefaultMessageDispatcher = class DefaultMessageDispatcher {
    constructor(repository, moduleRef) {
        this.repository = repository;
        this.moduleRef = moduleRef;
    }
    dispatch(message, messageType) {
        return (0, rxjs_1.of)(message).pipe((0, rxjs_1.mergeMap)((message) => {
            const queryHandler = this.repository.getFirstHandler(message, message_handler_repository_1.MessageHandlerRepository.metadataKeys[messageType ?? 'default']);
            return this.moduleRef.resolve(queryHandler, undefined, { strict: false });
        }), (0, rxjs_1.mergeMap)((handler) => handler.handle(message)));
    }
    dispatchQuery(query) {
        return this.dispatch(query, 'query');
    }
    dispatchCommand(command) {
        return this.dispatch(command, 'command');
    }
};
exports.DefaultMessageDispatcher = DefaultMessageDispatcher;
exports.DefaultMessageDispatcher = DefaultMessageDispatcher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_handler_repository_1.MessageHandlerRepository,
        core_1.ModuleRef])
], DefaultMessageDispatcher);
//# sourceMappingURL=default-message.dispatcher.js.map