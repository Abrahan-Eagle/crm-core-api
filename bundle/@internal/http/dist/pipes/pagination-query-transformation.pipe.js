"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationQueryTransformationPipe = void 0;
const queries_1 = require("../queries");
class PaginationQueryTransformationPipe {
    transform(query) {
        return queries_1.PaginationQuery.create(query.offset, query.limit, query.sort_by);
    }
}
exports.PaginationQueryTransformationPipe = PaginationQueryTransformationPipe;
//# sourceMappingURL=pagination-query-transformation.pipe.js.map