import { ExtractPrefixed } from '../types';
export type ExtractPrefixedOptions<C extends boolean> = {
    camelCase?: C;
};
export declare function extractPrefixed<K extends string, T extends Record<string, any> = Record<string, any>, C extends boolean = false>(prefix: K, value: T, options?: ExtractPrefixedOptions<C>): ExtractPrefixed<T, K, C>;
