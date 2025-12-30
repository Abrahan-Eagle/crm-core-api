import { ClientConfig, PubSub, Topic } from '@google-cloud/pubsub';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
export type EmitOptions = {
    topic: string;
    message: string;
    data: object;
    attributes?: Record<string, string> & {
        message?: never;
    };
};
export declare const ConfigProvider = "PUBSUB_CLIENT_CONFIG";
export declare class PubSubClient extends ClientProxy {
    private readonly clientConfig;
    protected topics: Map<string, Topic>;
    protected pubsubClient: PubSub;
    private readonly logger;
    constructor(clientConfig: ClientConfig);
    connect(): Promise<PubSub>;
    close(): Promise<void>;
    dispatchEvent(packet: ReadPacket<any>): Promise<any>;
    protected publish(packet: ReadPacket, callback: (packet: WritePacket) => void): () => void;
    protected serialize(packet: ReadPacket): EmitOptions;
    protected getTopic(topicName: string): Topic;
}
