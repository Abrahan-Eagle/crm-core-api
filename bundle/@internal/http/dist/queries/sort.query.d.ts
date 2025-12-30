import { Nullable, OptionalValue } from '@internal/common';
export declare const enum SORT_ORDER {
    ASC = "asc",
    DESC = "desc"
}
export declare class SortQuery {
    readonly order: SORT_ORDER;
    readonly field: string;
    private constructor();
    static create(sort: OptionalValue<string>): Nullable<SortQuery>;
    static isValidFormat(sort: string): boolean;
}
