import { Config, Optional } from '@internal/common';

export class NotificationAPIConfig extends Config {
  private constructor(
    public readonly clientId: string,
    public readonly clientSecret: string,
    public readonly channelId: string,
    public readonly baseAppUrl: string,
  ) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    const env = config.getFromObject('env');
    return new NotificationAPIConfig(
      <string>env.getFromObjectOrThrow('NOTIFICATION_API_CLIENT_ID'),
      <string>env.getFromObjectOrThrow('NOTIFICATION_API_CLIENT_SECRET'),
      <string>env.getFromObjectOrThrow('NOTIFICATION_API_CHANNEL_ID'),
      <string>env.getFromObjectOrThrow('WEB_APP_BASE_URL'),
    );
  }
}
