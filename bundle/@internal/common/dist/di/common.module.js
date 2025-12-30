"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CommonModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config");
const messages_1 = require("../messages");
const mapper_module_1 = require("./mapper.module");
let CommonModule = CommonModule_1 = class CommonModule {
    static forConfig(configs = []) {
        const manager = config_1.ConfigManager.register(configs);
        return {
            global: true,
            module: CommonModule_1,
            providers: [
                { provide: config_1.ConfigManager, useFactory: () => manager },
                ...configs.map((config) => {
                    return {
                        provide: config,
                        useFactory: (configManager) => configManager.get(config),
                        inject: [config_1.ConfigManager],
                    };
                }),
            ],
            exports: [config_1.ConfigManager, ...configs],
        };
    }
    static forRoot(options) {
        const forConfigModule = CommonModule_1.forConfig(options?.configs);
        const { imports = [], exports = [], controllers = [], providers = [] } = forConfigModule;
        return {
            global: true,
            module: CommonModule_1,
            imports: [mapper_module_1.MapperModule.forRoot(options?.mapperTransformers), ...imports],
            controllers: [...controllers],
            providers: [...providers],
            exports: [mapper_module_1.MapperModule, ...exports],
        };
    }
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = CommonModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
        controllers: [],
        providers: [
            messages_1.MessageHandlerRepository,
            { provide: "MessageDispatcher", useClass: messages_1.DefaultMessageDispatcher },
            { provide: "EventDispatcher", useClass: messages_1.DefaultEventDispatcher },
        ],
        exports: ["MessageDispatcher", "EventDispatcher"],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map