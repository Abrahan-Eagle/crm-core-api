"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortQuery = void 0;
const common_1 = require("@internal/common");
class SortQuery {
    constructor(order, field) {
        this.order = order;
        this.field = field;
    }
    static create(sort) {
        const optionalSort = common_1.Optional.ofUndefinable(sort)
            .filter((value) => typeof value === 'string')
            .map((value) => value.trim())
            .filter((value) => SortQuery.isValidFormat(value))
            .map((value) => [value.slice(0, 1), value.slice(1)]);
        if (!optionalSort.isPresent())
            return null;
        const [orderString, field] = optionalSort.getOrThrow();
        const order = orderString === '+' ? "asc" : "desc";
        return new SortQuery(order, field);
    }
    static isValidFormat(sort) {
        const regexFormat = /^(\+|\-)(\w+)$/;
        return regexFormat.test(sort);
    }
}
exports.SortQuery = SortQuery;
//# sourceMappingURL=sort.query.js.map