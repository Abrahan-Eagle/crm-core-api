"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const context_storages_1 = require("../context-storages");
const filters_1 = require("../filters");
const middlewares_1 = require("../middlewares");
let HttpModule = class HttpModule {
};
exports.HttpModule = HttpModule;
exports.HttpModule = HttpModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        providers: [
            ...middlewares_1.HttpMiddlewares,
            { provide: context_storages_1.RequestContextStorage, useValue: new context_storages_1.RequestContextStorage() },
            { provide: context_storages_1.AuthContextStorage, useValue: new context_storages_1.AuthContextStorage() },
            ...filters_1.GlobalExceptionFilters.map((filter) => ({ provide: core_1.APP_FILTER, useClass: filter })),
        ],
        exports: [context_storages_1.RequestContextStorage, context_storages_1.AuthContextStorage],
    })
], HttpModule);
//# sourceMappingURL=http.module.js.map