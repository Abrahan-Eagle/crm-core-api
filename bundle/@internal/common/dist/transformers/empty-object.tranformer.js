"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyObjectTransformer = void 0;
class EmptyObjectTransformer {
    transform(value) {
        for (const key in value) {
            const keyValue = value[key];
            const isNotObject = typeof keyValue !== 'object' || keyValue instanceof Date || !keyValue;
            if (isNotObject)
                continue;
            if (Object.keys(keyValue).length !== 0 || Array.isArray(keyValue)) {
                this.transform(keyValue);
                continue;
            }
            delete value[key];
        }
    }
}
exports.EmptyObjectTransformer = EmptyObjectTransformer;
//# sourceMappingURL=empty-object.tranformer.js.map