export declare class ErrorCode {
    readonly value: string;
    readonly description: string;
    protected constructor(value: string, description: string);
    protected static of(value: string, description: string): ErrorCode;
    format(...args: string[]): string;
}
export declare class DomainErrorCode extends ErrorCode {
    protected constructor(value: string, description: string);
    static readonly NOT_FOUND: ErrorCode;
    static readonly UNAUTHORIZED_USER: ErrorCode;
    static readonly MESSAGE_DUPLICATED: ErrorCode;
    static readonly EMAIL_EMPTY: ErrorCode;
    static readonly EMAIL_INVALID: ErrorCode;
    static readonly EMAIL_VERIFIED_EMPTY: ErrorCode;
    static readonly EMAIL_VERIFIED_INVALID: ErrorCode;
    static readonly EMAIL_VERIFIED_AT_INVALID: ErrorCode;
    static readonly EMAIL_VERIFIED_AT_EMPTY: ErrorCode;
    static readonly PHONE_INTL_PREFIX_EMPTY: ErrorCode;
    static readonly PHONE_REGION_CODE_EMPTY: ErrorCode;
    static readonly PHONE_NUMBER_EMPTY: ErrorCode;
    static readonly PHONE_INTL_PREFIX_INVALID: ErrorCode;
    static readonly PHONE_REGION_CODE_INVALID: ErrorCode;
    static readonly PHONE_NUMBER_INVALID: ErrorCode;
    static readonly ADDRESS_LINE_1_INVALID: ErrorCode;
    static readonly ADDRESS_LINE_2_INVALID: ErrorCode;
    static readonly STATE_INVALID: ErrorCode;
    static readonly CITY_INVALID: ErrorCode;
    static readonly ZIP_CODE_INVALID: ErrorCode;
    static readonly COUNTRY_ISO_CODE_EMPTY: ErrorCode;
    static readonly COUNTRY_ISO_CODE_INVALID: ErrorCode;
    static readonly LAST_NAME_INVALID: ErrorCode;
    static readonly LAST_NAME_EMPTY: ErrorCode;
    static readonly FIRST_NAME_LENGTH_INVALID: ErrorCode;
    static readonly FIRST_NAME_INVALID: ErrorCode;
    static readonly FIRST_NAME_EMPTY: ErrorCode;
    static readonly CREATED_AT_EMPTY: ErrorCode;
    static readonly CREATED_AT_INVALID: ErrorCode;
    static readonly UPDATED_AT_INVALID: ErrorCode;
    static readonly USER_ID_EMPTY: ErrorCode;
    static readonly USER_ID_INVALID: ErrorCode;
    static readonly PROVIDER_ID_EMPTY: ErrorCode;
    static readonly PROVIDER_ID_INVALID: ErrorCode;
}
