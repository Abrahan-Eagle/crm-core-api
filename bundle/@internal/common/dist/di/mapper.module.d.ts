import { DynamicModule } from '@nestjs/common';
import { Transformer } from '../mappers';
import { ConstructableType } from '../types';
export declare class MapperModule {
    static forRoot(transformers?: ConstructableType<Transformer<unknown>>[]): DynamicModule;
}
