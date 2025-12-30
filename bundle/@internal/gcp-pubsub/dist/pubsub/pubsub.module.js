"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PubSubModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubModule = void 0;
const common_1 = require("@nestjs/common");
const context_storages_1 = require("../context-storages");
const pubsub_client_1 = require("./pubsub.client");
const pubsub_service_1 = require("./pubsub.service");
let PubSubModule = PubSubModule_1 = class PubSubModule {
    static forRoot(params) {
        return { global: true, module: PubSubModule_1, providers: [{ provide: pubsub_client_1.ConfigProvider, useValue: params.config }] };
    }
};
exports.PubSubModule = PubSubModule;
exports.PubSubModule = PubSubModule = PubSubModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            pubsub_service_1.PubSubService,
            pubsub_client_1.PubSubClient,
            { provide: context_storages_1.EventQueueContextStorage, useValue: new context_storages_1.EventQueueContextStorage() },
        ],
        exports: [pubsub_service_1.PubSubService, context_storages_1.EventQueueContextStorage],
    })
], PubSubModule);
//# sourceMappingURL=pubsub.module.js.map