import { Config, Optional } from '@internal/common';

export class URLSignerConfig extends Config {
  private constructor(
    public readonly privateKey: string,
    public readonly keyPairId: string,
  ) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    const env = config.getFromObject('env');
    return {
      privateKey: <string>env.getFromObjectOrThrow('URL_SIGNER_PRIVATE_KEY').replace(/\\n/g, '\n'),
      keyPairId: <string>env.getFromObjectOrThrow('URL_SIGNER_KEY_PAIR_ID'),
    };
  }
}
