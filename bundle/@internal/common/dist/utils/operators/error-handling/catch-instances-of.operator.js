"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchInstanceOf = void 0;
const rxjs_1 = require("rxjs");
function catchInstanceOf(errorClass, handleError) {
    return (0, rxjs_1.catchError)((error) => {
        const classes = Array.isArray(errorClass) ? errorClass : [errorClass];
        const caughtInstance = classes.some((clazz) => error instanceof clazz);
        if (!caughtInstance)
            return (0, rxjs_1.throwError)(() => error);
        const result = handleError(error);
        return (0, rxjs_1.isObservable)(result) ? result : (0, rxjs_1.of)(result);
    });
}
exports.catchInstanceOf = catchInstanceOf;
//# sourceMappingURL=catch-instances-of.operator.js.map