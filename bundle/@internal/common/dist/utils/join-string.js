"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinString = void 0;
const joinString = (separator, ...paths) => {
    return paths.filter(Boolean).join(separator);
};
exports.joinString = joinString;
//# sourceMappingURL=join-string.js.map