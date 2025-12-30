import { Config, Optional } from '@internal/common';

export interface MailerConfig {
  apiKey: string;
  secret: string;
}

export class MailerServiceConfig extends Config {
  private constructor(public readonly config: MailerConfig) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    return new MailerServiceConfig(this.loadMailerConfig(config));
  }

  private static loadMailerConfig(config: Optional<Record<string, any>>): MailerConfig {
    const env = config.getFromObject('env');
    return {
      apiKey: <string>env.getFromObjectOrThrow('SES_API_KEY'),
      secret: <string>env.getFromObjectOrThrow('SES_SECRET_KEY'),
    };
  }
}
