"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPrefixed = void 0;
function extractPrefixed(prefix, value, options) {
    const result = {};
    Object.keys(value).forEach((key) => {
        if (!key.startsWith(prefix))
            return;
        let newKey = key.replace(prefix, '');
        if (options?.camelCase) {
            newKey = (newKey.charAt(0).toLowerCase() + newKey.slice(1));
        }
        result[newKey] = value[key];
    });
    return result;
}
exports.extractPrefixed = extractPrefixed;
//# sourceMappingURL=extract-prefixed-keys.js.map