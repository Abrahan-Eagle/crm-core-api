"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonNullishTransformer = void 0;
const config_1 = require("../config");
class NonNullishTransformer {
    transform(value) {
        for (const key in value) {
            if (!config_1.NULLISH_VALUES.includes(value[key])) {
                this.tryNestedTransform(value[key]);
                continue;
            }
            delete value[key];
        }
    }
    tryNestedTransform(value) {
        if (typeof value !== 'object' || value instanceof Date)
            return;
        return this.transform(value);
    }
}
exports.NonNullishTransformer = NonNullishTransformer;
//# sourceMappingURL=non-nullish.tranformer.js.map