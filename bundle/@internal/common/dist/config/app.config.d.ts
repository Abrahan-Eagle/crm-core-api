import { Optional } from '../types';
import { Config } from './config';
import { ENVIRONMENTS } from './constants';
export interface ServerConfig {
    port: number;
    prefix: string;
    allowOrigins: string;
}
export interface BaseAppConfig {
    name: string;
    log: {
        level: string;
        warnLevelPath: string;
        debugLevelPath: string;
    };
    author: string | string[];
    environment: ENVIRONMENTS;
}
export declare class AppConfig extends Config {
    readonly app: BaseAppConfig;
    readonly server: ServerConfig;
    private readonly logger;
    private constructor();
    isDevelopment(): boolean;
    isProduction(): boolean;
    static load(config: Optional<Record<string, any>>): Config;
    private static loadAppConfig;
    private static loadServerConfig;
    printUsage(): void;
    printVerbose(): void;
}
