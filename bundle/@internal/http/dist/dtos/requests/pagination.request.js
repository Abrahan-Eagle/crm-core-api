"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = exports.DEFAULT_LIMIT_PAGE = exports.DEFAULT_PAGE = void 0;
const common_1 = require("@internal/common");
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_LIMIT_PAGE = 10;
class Pagination {
    constructor(limit, page) {
        this.limit = limit;
        this.page = page;
    }
    skip() {
        return this.limit * this.page - this.limit;
    }
    static create(limit, page) {
        const resLimit = common_1.Optional.ofUndefinable(limit)
            .filter(Boolean)
            .filter((value) => !isNaN(value))
            .map((value) => parseInt(value, 10))
            .map((value) => Math.min(value, this.MAX_SIZE))
            .map((value) => Math.max(value, this.MIN_SIZE))
            .orElse(exports.DEFAULT_LIMIT_PAGE);
        const resPage = common_1.Optional.ofUndefinable(page)
            .filter(Boolean)
            .filter((value) => !isNaN(value))
            .map((value) => parseInt(value, 10))
            .map((value) => Math.max(value, this.MIN_PAGE))
            .orElse(exports.DEFAULT_PAGE);
        return new Pagination(resLimit, resPage);
    }
}
exports.Pagination = Pagination;
Pagination.MAX_SIZE = 20;
Pagination.MIN_SIZE = 1;
Pagination.MIN_PAGE = 1;
//# sourceMappingURL=pagination.request.js.map