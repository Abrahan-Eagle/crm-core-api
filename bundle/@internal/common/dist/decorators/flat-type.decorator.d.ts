import { Type } from '@nestjs/common';
export declare const FlatType: <T extends {}>(type: () => Type<T>, options?: {
    prefix: string;
    camelCase?: boolean;
}) => PropertyDecorator;
