"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIf = void 0;
const rxjs_1 = require("rxjs");
function validateIf(iif, mapError) {
    return (0, rxjs_1.mergeMap)((value) => {
        if (iif(value))
            return (0, rxjs_1.of)(value);
        return (0, rxjs_1.throwError)(() => mapError(value));
    });
}
exports.validateIf = validateIf;
//# sourceMappingURL=validate-if.operator.js.map