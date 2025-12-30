import { InvalidValueException } from '@internal/common';
import { AuthContextStorage, AuthContextStore } from '@internal/http';

export class ExtendedAuthContextStorage extends AuthContextStorage {
  override get store(): AuthContextStore & { tenantId: string; permissions: string[] } {
    const store = this.getStore();
    if (!store) {
      throw new InvalidValueException('AuthContextStore', 'AuthContextStore is not defined');
    }
    return store as AuthContextStore & { tenantId: string; permissions: string[] };
  }
}
