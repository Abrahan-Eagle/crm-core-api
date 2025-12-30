"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const node_fs_1 = require("node:fs");
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
const yaml = __importStar(require("js-yaml"));
const types_1 = require("../types");
(0, dotenv_1.config)();
class ConfigManager {
    static getConfigValues() {
        return (this._configValues ??= types_1.Optional.ofUndefinable(process.env)
            .getFromObject('CONFIG_PATH')
            .replaceIfEmpty('./.config/config.yaml')
            .map((path) => (0, node_fs_1.readFileSync)(path, 'utf8'))
            .map((yamlString) => yaml.load(yamlString))
            .map((config) => ({ ...config, env: process.env })));
    }
    constructor(configs = new Map()) {
        this.configs = configs;
        this.logger = new common_1.Logger(ConfigManager.name);
    }
    static get(type) {
        return this.register([type]).get(type);
    }
    get(type) {
        const config = this.configs.get(type);
        if (!config)
            throw new Error(`Config ${type.name} not found.`);
        return config;
    }
    static register(configs) {
        const manager = this.getInstance();
        configs.forEach((config) => {
            if (manager.configs.has(config))
                return;
            manager.configs.set(config, config.loadInstance(this.getConfigValues()));
        });
        return manager;
    }
    static getInstance() {
        return (this._instance ??= new ConfigManager());
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=config-manager.js.map