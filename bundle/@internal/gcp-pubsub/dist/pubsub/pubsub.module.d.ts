import { DynamicModule } from '@nestjs/common';
import { PubSubServerOptions } from './pubsub.server';
export declare class PubSubModule {
    static forRoot(params: PubSubServerOptions): DynamicModule;
}
