"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
require("winston-daily-rotate-file");
const node_path_1 = __importDefault(require("node:path"));
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config");
function createLogger(options) {
    const { log, name, environment } = options;
    const transports = [
        new winston_1.default.transports.DailyRotateFile({
            filename: node_path_1.default.resolve(log.warnLevelPath, 'combined-warn-error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: config_1.LogLevelKey.WARN,
        }),
        new winston_1.default.transports.DailyRotateFile({
            filename: node_path_1.default.resolve(log.debugLevelPath, 'combined-all-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: config_1.LogLevelKey.DEBUG,
        }),
    ];
    transports.push(new winston_1.default.transports.Console({
        level: log.level,
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: () => ` ${new Date().toISOString()}` }), nest_winston_1.utilities.format.nestLike(name, { colors: true, prettyPrint: true })),
    }));
    winston_1.default.addColors(config_1.LOG_LEVELS.colors);
    const defaultMeta = Object.keys(options.defaultMetadata).reduce((acc, key) => {
        const value = options.defaultMetadata[key];
        Object.defineProperty(acc, key, {
            get: typeof value === 'function' ? value : () => value,
            enumerable: true,
        });
        return acc;
    }, { name, environment });
    const logger = nest_winston_1.WinstonModule.createLogger({
        defaultMeta,
        levels: config_1.LOG_LEVELS.levels,
        level: log.level,
        transports,
    });
    common_1.Logger.overrideLogger(logger);
    return logger;
}
exports.createLogger = createLogger;
//# sourceMappingURL=winston-logger.js.map