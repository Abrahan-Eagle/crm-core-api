import type { Message } from '@google-cloud/pubsub';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class PayloadDataTransformationPipe implements PipeTransform {
    transform(value: Message, metadata: ArgumentMetadata): import("@internal/common").Serializable;
}
