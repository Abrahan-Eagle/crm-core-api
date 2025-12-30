import { Config, Optional } from '@internal/common';

export interface SchedulerConfig {
  currentServiceUrl: string;
  baseUrl: string;
  webhookAuthKey: string;
}

export class SchedulerServiceConfig extends Config {
  private constructor(public readonly config: SchedulerConfig) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    return new SchedulerServiceConfig(this.loadSchedulerConfig(config));
  }

  private static loadSchedulerConfig(config: Optional<Record<string, any>>): SchedulerConfig {
    const env = config.getFromObject('env');
    return {
      currentServiceUrl: <string>env.getFromObjectOrThrow('CURRENT_SERVICE_BASE_URL'),
      baseUrl: <string>env.getFromObjectOrThrow('SCHEDULER_SERVICE_BASE_URL'),
      webhookAuthKey: <string>env.getFromObjectOrThrow('WEBHOOK_AUTH_KEY'),
    };
  }
}
