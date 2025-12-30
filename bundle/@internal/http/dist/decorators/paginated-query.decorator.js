"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedQuery = void 0;
const common_1 = require("@nestjs/common");
const pipes_1 = require("../pipes");
const PaginatedQuery = () => (0, common_1.Query)(new pipes_1.PaginationQueryTransformationPipe());
exports.PaginatedQuery = PaginatedQuery;
//# sourceMappingURL=paginated-query.decorator.js.map