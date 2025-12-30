import { Config, Optional } from '@internal/common';

export class IdentityProviderConfig extends Config {
  private constructor(
    public readonly domain: string,
    public readonly clientId: string,
    public readonly clientSecret: string,
    public readonly audience: string,
    public readonly guestUsersClientId: string,
    public readonly guestUsersClientSecret: string,
  ) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    const env = config.getFromObject('env');
    return new IdentityProviderConfig(
      <string>env.getFromObjectOrThrow('AUTH0_DOMAIN'),
      <string>env.getFromObjectOrThrow('AUTH0_CLIENT_ID'),
      <string>env.getFromObjectOrThrow('AUTH0_CLIENT_SECRET'),
      <string>env.getFromObjectOrThrow('AUTH0_AUDIENCE'),
      <string>env.getFromObjectOrThrow('AUTH0_GUEST_USERS_CLIENT_ID'),
      <string>env.getFromObjectOrThrow('AUTH0_GUEST_USERS_CLIENT_SECRET'),
    );
  }
}
