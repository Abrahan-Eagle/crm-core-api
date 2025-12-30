"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationQuery = exports.MAX_LIMIT = exports.MIN_LIMIT = exports.DEFAULT_LIMIT = exports.MIN_OFFSET = exports.DEFAULT_OFFSET = void 0;
const common_1 = require("@internal/common");
const sort_query_1 = require("./sort.query");
exports.DEFAULT_OFFSET = 0;
exports.MIN_OFFSET = 0;
exports.DEFAULT_LIMIT = 10;
exports.MIN_LIMIT = 1;
exports.MAX_LIMIT = 20;
class PaginationQuery {
    constructor(offset, limit, sortBy) {
        this.offset = offset;
        this.limit = limit;
        this.sortBy = sortBy;
    }
    withFields(allowedFields) {
        return new PaginationQuery(this.offset, this.limit, this.sortBy.filter((sort) => allowedFields.includes(sort.field)));
    }
    hasSortBy() {
        return this.sortBy.length > 0;
    }
    getSortObject() {
        return this.sortBy.reduce((acc, sort) => ({ ...acc, [sort.field]: sort.order }), {});
    }
    static create(offset, limit, sortBy) {
        const resOffset = common_1.Optional.ofUndefinable(offset)
            .filter(Boolean)
            .filter((value) => !isNaN(value))
            .map((value) => parseInt(value, 10))
            .map((value) => Math.max(value, exports.MIN_OFFSET))
            .orElse(exports.DEFAULT_OFFSET);
        const resLimit = common_1.Optional.ofUndefinable(limit)
            .filter(Boolean)
            .filter((value) => !isNaN(value))
            .map((value) => parseInt(value, 10))
            .map((value) => Math.min(value, exports.MAX_LIMIT))
            .map((value) => Math.max(value, exports.MIN_LIMIT))
            .orElse(exports.DEFAULT_LIMIT);
        const resSortBy = common_1.Optional.ofUndefinable(sortBy)
            .filter(Boolean)
            .filter((value) => typeof value === 'string')
            .map((value) => value.trim())
            .map((value) => value.split(','))
            .map((value) => value.map((value) => sort_query_1.SortQuery.create(value)))
            .map((sorts) => sorts.filter((sort) => Boolean(sort)))
            .orElse([]);
        return new PaginationQuery(resOffset, resLimit, resSortBy);
    }
}
exports.PaginationQuery = PaginationQuery;
//# sourceMappingURL=pagination.query.js.map