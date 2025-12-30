"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponse = void 0;
class PaginatedResponse {
    constructor(data, pagination) {
        this.data = data;
        this.pagination = pagination;
    }
    toJSON() {
        return {
            data: this.data,
            pagination: {
                offset: this.pagination.offset,
                limit: this.pagination.limit,
                total_pages: this.pagination.totalPages,
                number_of_items: this.pagination.numberOfItems,
                total_items: this.pagination.totalItems,
                sorted_by: this.pagination.sortedBy,
            },
        };
    }
    static of(data, total, pagination) {
        return new PaginatedResponse(data, {
            offset: pagination.offset,
            limit: pagination.limit,
            totalItems: total,
            totalPages: Math.ceil(total / pagination.limit),
            numberOfItems: data.length,
            sortedBy: pagination.sortBy.map((sort) => ({ order: sort.order, field: sort.field })),
        });
    }
}
exports.PaginatedResponse = PaginatedResponse;
//# sourceMappingURL=paginated.response.js.map