"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../errors");
const types_1 = require("../types");
const config_1 = require("./config");
const constants_1 = require("./constants");
class AppConfig extends config_1.Config {
    constructor(app, server) {
        super();
        this.app = app;
        this.server = server;
        this.logger = new common_1.Logger(AppConfig.name);
    }
    isDevelopment() {
        return this.app.environment === "dev";
    }
    isProduction() {
        return this.app.environment === "prod";
    }
    static load(config) {
        return new AppConfig(AppConfig.loadAppConfig(config), AppConfig.loadServerConfig(config));
    }
    static loadAppConfig(config) {
        const app = config.getFromObject('app');
        const env = config.getFromObject('env');
        const environment = (env.getFromObject('NODE_ENV').filter(Boolean).replaceIfEmpty("dev").getOrThrow());
        return {
            name: app.getFromObjectOrThrow('name'),
            author: app.getFromObjectOrThrow('author'),
            environment,
            log: {
                level: types_1.Validator.of(app.getFromObjectOrThrow('logLevel'))
                    .enum(constants_1.LogLevelKey, (value) => new errors_1.InvalidValueException(value ?? 'Empty string', `Invalid log level. Valid values are ${Object.values(constants_1.LogLevelKey)}`))
                    .getOrThrow(),
                warnLevelPath: env.getFromObject('LOG_WARN_PATH').filter(Boolean).replaceIfEmpty('./logs').getOrThrow(),
                debugLevelPath: env.getFromObject('LOG_COMBINED_PATH').filter(Boolean).replaceIfEmpty('./logs').getOrThrow(),
            },
        };
    }
    static loadServerConfig(config) {
        const server = config.getFromObject('server');
        return {
            port: server
                .getFromObject('port')
                .map((value) => parseInt(value, 10))
                .orElse(8080),
            prefix: server.getFromObjectOrThrow('contextPath'),
            allowOrigins: server.getFromObjectOrThrow('allowedOrigins'),
        };
    }
    printUsage() {
        const { server, app } = this;
        this.logger.log(`${app.name} running on port ${server.port}...`);
    }
    printVerbose() {
        this.logger.log(`Printing app config: `, AppConfig.name);
    }
}
exports.AppConfig = AppConfig;
//# sourceMappingURL=app.config.js.map