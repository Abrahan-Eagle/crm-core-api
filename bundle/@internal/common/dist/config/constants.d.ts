export declare const enum CommonConstant {
    EVENT_DISPATCHER = "EventDispatcher",
    MESSAGE_DISPATCHER = "MessageDispatcher"
}
export declare const enum ENVIRONMENTS {
    DEV = "dev",
    PROD = "prod",
    TEST = "test"
}
export declare enum LogLevelKey {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug",
    TRACE = "trace"
}
export declare const LOG_LEVELS: {
    levels: {
        error: number;
        warn: number;
        info: number;
        debug: number;
        trace: number;
    };
    colors: {
        error: string;
        warn: string;
        info: string;
        debug: string;
        trace: string;
    };
};
export declare const NULLISH_VALUES: (null | undefined)[];
