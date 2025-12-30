import { Config, Optional } from '@internal/common';

export class VoIPProviderConfig extends Config {
  private constructor(
    public readonly baseUrl: string,
    public readonly clientId: string,
    public readonly clientSecret: string,
  ) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    const env = config.getFromObject('env');
    return new VoIPProviderConfig(
      <string>env.getFromObjectOrThrow('VOIP_BASE_URL'),
      <string>env.getFromObjectOrThrow('VOIP_CLIENT_ID'),
      <string>env.getFromObjectOrThrow('VOIP_CLIENT_SECRET'),
    );
  }
}
