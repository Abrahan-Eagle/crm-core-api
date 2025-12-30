import { Config, Optional } from '@internal/common';
export declare class MongoConfig extends Config {
    readonly database: string;
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
    readonly srv: boolean;
    readonly options?: string | undefined;
    protected constructor(database: string, user: string, password: string, host: string, port: number, srv: boolean, options?: string | undefined);
    get uri(): string;
    static load(config: Optional<Record<string, any>>): MongoConfig;
}
