import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class RequestTransformationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): import("@internal/common").Serializable;
}
