import { Optional, Type } from '../types';
export declare abstract class Config {
    protected static _instance: Config;
    static loadInstance(config: Optional<Record<string, any>>): Config;
    static load(config: Optional<Record<string, any>>): Config;
    protected constructor();
    static getInstance<T extends Config>(this: Type<T>): T;
}
