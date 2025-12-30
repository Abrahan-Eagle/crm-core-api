import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { User } from '../entities';
import { Role } from '../types';

export interface IdentityProviderRepository {
  getRoles(): Observable<Role[]>;
  createUser(user: User, password: string, roles: string[], tenants: string[]): Observable<void>;
  addRole(identityUserId: string, role: string): Observable<void>;
  removeRole(identityUserId: string, role: string): Observable<void>;
  getUserIdByEmail(email: string): Observable<Nullable<string>>;
  updateTenants(identityUserId: string, user: User): Observable<void>;
  enableUser(identityUserId: string): Observable<void>;
  disableUser(identityUserId: string): Observable<void>;

  getSystemAccessToken(): Observable<string>;
}
