import { Type } from '../types';
import { Config } from './config';
export declare class ConfigManager {
    private readonly configs;
    private static _instance;
    private static _configValues;
    private static getConfigValues;
    private readonly logger;
    private constructor();
    static get<T extends Config>(type: Type<T>): T;
    get<T extends Config>(type: Type<T>): T;
    static register(configs: Type<Config>[]): ConfigManager;
    static getInstance(): ConfigManager;
}
