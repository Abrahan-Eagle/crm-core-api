import { ArgumentMetadata, Body, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DynamicRequestTransformationPipe implements PipeTransform {
  private readonly DEFAULT_CONTENT_KEY = 'body';

  transform(value: any, metadata: ArgumentMetadata) {
    if (value[this.DEFAULT_CONTENT_KEY]) {
      try {
        return plainToInstance(metadata.metatype as any, JSON.parse(value[this.DEFAULT_CONTENT_KEY]), {
          excludeExtraneousValues: true,
        });
      } catch (error) {
        return;
      }
    }
    return plainToInstance(metadata.metatype as any, value, { excludeExtraneousValues: true });
  }
}

/**
    This decorator allows you to instantiate the body, 
    regardless of whether the request was json or form-data.
**/
export const DynamicMappedBody = () => Body(new DynamicRequestTransformationPipe());
