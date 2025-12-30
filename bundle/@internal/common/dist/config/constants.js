"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULLISH_VALUES = exports.LOG_LEVELS = exports.LogLevelKey = void 0;
var LogLevelKey;
(function (LogLevelKey) {
    LogLevelKey["ERROR"] = "error";
    LogLevelKey["WARN"] = "warn";
    LogLevelKey["INFO"] = "info";
    LogLevelKey["DEBUG"] = "debug";
    LogLevelKey["TRACE"] = "trace";
})(LogLevelKey || (exports.LogLevelKey = LogLevelKey = {}));
exports.LOG_LEVELS = {
    levels: { error: 0, warn: 1, info: 2, debug: 3, trace: 4 },
    colors: { error: 'red', warn: 'yellow', info: 'green', debug: 'blue', trace: 'magenta' },
};
exports.NULLISH_VALUES = [null, undefined];
//# sourceMappingURL=constants.js.map