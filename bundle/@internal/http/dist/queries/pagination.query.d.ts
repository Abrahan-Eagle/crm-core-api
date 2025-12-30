import { OptionalValue } from '@internal/common';
import { SortQuery } from './sort.query';
export declare const DEFAULT_OFFSET = 0;
export declare const MIN_OFFSET = 0;
export declare const DEFAULT_LIMIT = 10;
export declare const MIN_LIMIT = 1;
export declare const MAX_LIMIT = 20;
export declare class PaginationQuery {
    readonly offset: number;
    readonly limit: number;
    readonly sortBy: SortQuery[];
    protected constructor(offset: number, limit: number, sortBy: SortQuery[]);
    withFields(allowedFields: string[]): PaginationQuery;
    hasSortBy(): boolean;
    getSortObject(): Record<SortQuery['field'], SortQuery['order']>;
    static create(offset: OptionalValue<string>, limit: OptionalValue<string>, sortBy: OptionalValue<string>): PaginationQuery;
}
