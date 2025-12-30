import { Config, Optional, Validator } from '@internal/common';

import { InvalidEntityMediaType } from '@/domain/common';

import { ENTITY_MEDIA_TYPE } from './constants';
import { MediaGroupConfig } from './media-group.config';

export class MediaConfig extends Config {
  private constructor(
    private readonly _types: MediaGroupConfig[],
    public readonly region: string,
    public readonly secret: string,
    public readonly key: string,
  ) {
    super();
  }

  getMediaConfig(type: string): MediaGroupConfig {
    return Validator.of(type)
      .required(() => new InvalidEntityMediaType('empty'))
      .enum(ENTITY_MEDIA_TYPE, (type) => new InvalidEntityMediaType(type))
      .map((type) => this._types.find((config) => config.entity === type))
      .required((type) => new InvalidEntityMediaType(type))
      .getOrThrow();
  }

  static load(config: Optional<Record<string, any>>): Config {
    const env = config.getFromObject('env');
    return new MediaConfig(
      config
        .getFromObject('media')
        .getFromObjectOrThrow('buckets')
        .map((group: any) => MediaGroupConfig.createFromOptional(Optional.of(group))),
      <string>env.getFromObjectOrThrow('AWS_S3_REGION'),
      <string>env.getFromObjectOrThrow('AWS_S3_SECRET'),
      <string>env.getFromObjectOrThrow('AWS_S3_KEY'),
    );
  }
}
