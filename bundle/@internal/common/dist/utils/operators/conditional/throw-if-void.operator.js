"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwIfVoid = void 0;
const rxjs_1 = require("rxjs");
const types_1 = require("../../../types");
const throwIfVoid = (mapError) => {
    return (0, rxjs_1.map)((value) => types_1.Validator.of(value).required(mapError).getOrThrow());
};
exports.throwIfVoid = throwIfVoid;
//# sourceMappingURL=throw-if-void.operator.js.map