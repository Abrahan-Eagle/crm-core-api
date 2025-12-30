import { DynamicModule } from '@nestjs/common';
import { Config } from '../config';
import { Transformer } from '../mappers';
import { ConstructableType, Type } from '../types';
export declare class CommonModule {
    static forConfig(configs?: Type<Config>[]): DynamicModule;
    static forRoot(options?: {
        configs?: Type<Config>[];
        mapperTransformers?: ConstructableType<Transformer<unknown>>[];
    }): {
        global: boolean;
        module: typeof CommonModule;
        imports: (import("@nestjs/common").Type<any> | DynamicModule | Promise<DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
        controllers: import("@nestjs/common").Type<any>[];
        providers: import("@nestjs/common").Provider[];
        exports: (string | symbol | Function | DynamicModule | import("@nestjs/common").ClassProvider<any> | import("@nestjs/common").ValueProvider<any> | import("@nestjs/common").FactoryProvider<any> | import("@nestjs/common").ExistingProvider<any> | Promise<DynamicModule> | import("@nestjs/common").ForwardReference<any>)[];
    };
}
