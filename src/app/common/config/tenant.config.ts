import { Config, Optional } from '@internal/common';

export interface TenantDetails {
  id: string;
  email: string;
}

export class TenantConfig extends Config {
  private constructor(public readonly tenants: TenantDetails[]) {
    super();
  }

  static load(config: Optional<Record<string, any>>): Config {
    return new TenantConfig(this.loadTenants(config));
  }

  private static loadTenants(config: Optional<Record<string, any>>): TenantDetails[] {
    const tenants = config.getFromObject('tenants').getOrThrow();

    return Object.keys(tenants).map((tenant) => {
      return {
        email: Optional.of(tenants[tenant]?.[0])
          .getFromObject('email')
          .getOrThrow(),
        id: tenant,
      } as TenantDetails;
    });
  }
}
