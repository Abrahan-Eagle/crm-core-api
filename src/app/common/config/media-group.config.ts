import { Optional } from '@internal/common';

export class MediaGroupConfig {
  private constructor(
    public readonly entity: string,
    public readonly uri: string,
    public readonly bucket: string,
    public readonly path: string,
  ) {}

  static createFromOptional(optional: Optional<Partial<MediaGroupConfig>>): MediaGroupConfig {
    return new MediaGroupConfig(
      optional.getFromObjectOrThrow('entity'),
      optional.getFromObjectOrThrow('uri'),
      optional.getFromObjectOrThrow('bucket'),
      optional.getFromObjectOrThrow('path'),
    );
  }
}
