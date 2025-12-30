import { PaginationQuery } from '../../queries';
export declare class PaginatedResponse<T> {
    readonly data: T[];
    readonly pagination: {
        readonly offset: number;
        readonly limit: number;
        readonly totalPages: number;
        readonly numberOfItems: number;
        readonly totalItems: number;
        readonly sortedBy: {
            readonly order: string;
            readonly field: string;
        }[];
    };
    private constructor();
    toJSON(): object;
    static of<T>(data: T[], total: number, pagination: PaginationQuery): PaginatedResponse<T>;
}
