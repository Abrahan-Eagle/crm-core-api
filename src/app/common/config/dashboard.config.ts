import { Config, Optional } from '@internal/common';

export class DashboardConfig extends Config {
  private constructor(
    public readonly baseUrl: string,
    public readonly apiKey: string,
  ) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    const env = config.getFromObject('env');
    return new DashboardConfig(
      <string>env.getFromObjectOrThrow('DASHBOARD_BASE_URL'),
      <string>env.getFromObjectOrThrow('DASHBOARD_API_KEY'),
    );
  }
}
