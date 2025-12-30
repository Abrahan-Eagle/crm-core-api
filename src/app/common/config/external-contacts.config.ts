import { Config, Optional } from '@internal/common';

export class ExternalContactsConfig extends Config {
  private constructor(
    public readonly baseUrl: string,
    public readonly secret: Record<string, { key: string; abandoned_tag: number; audience_tag: number }>,
  ) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    const env = config.getFromObject('env');
    return new ExternalContactsConfig(
      <string>env.getFromObjectOrThrow('SYSTEME_BASE_URL'),
      JSON.parse(<string>env.getFromObjectOrThrow('SYSTEME_API_KEY')),
    );
  }
}
