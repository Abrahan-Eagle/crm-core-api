import { Message } from '@google-cloud/pubsub';
import { BaseRpcContext } from '@nestjs/microservices';
export declare class PubSubContext extends BaseRpcContext<[Message, string]> {
    constructor(args: [Message, string]);
}
