"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMapper = void 0;
class AbstractMapper {
    mapFromList(from) {
        return from.map((item) => this.map(item));
    }
    reverseMapFromList(from) {
        return from.map((item) => this.reverseMap(item));
    }
}
exports.AbstractMapper = AbstractMapper;
//# sourceMappingURL=abstract.mapper.js.map