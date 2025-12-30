import { OptionalValue } from '@internal/common';
export declare const DEFAULT_PAGE = 1;
export declare const DEFAULT_LIMIT_PAGE = 10;
export declare class Pagination {
    readonly limit: number;
    readonly page: number;
    static MAX_SIZE: number;
    static MIN_SIZE: number;
    static MIN_PAGE: number;
    protected constructor(limit: number, page: number);
    skip(): number;
    static create(limit: OptionalValue<string>, page: OptionalValue<string>): Pagination;
}
