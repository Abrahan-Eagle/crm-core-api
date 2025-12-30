import { mapToVoid, Nullable } from '@internal/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ManagementClient, TokenSet } from 'auth0';
import { Cache } from 'cache-manager';
import { delayWhen, from, iif, map, mergeMap, Observable, of } from 'rxjs';

import { IdentityProviderConfig } from '@/app/common';
import { IdentityProviderRepository, Role, User } from '@/domain/user';

@Injectable()
export class Auth0IdentityProviderRepository implements IdentityProviderRepository {
  private readonly systemTokenKey = 'system_token';

  constructor(
    private readonly management: ManagementClient,
    private http: HttpService,
    private readonly config: IdentityProviderConfig,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  getSystemAccessToken(): Observable<string> {
    return from(this.cacheManager.get<string>(this.systemTokenKey)).pipe(
      mergeMap((token) =>
        iif(
          () => !!token,
          of(token!),
          this.http
            .post<TokenSet>(`https://${this.config.domain}/oauth/token`, {
              client_id: this.config.guestUsersClientId,
              client_secret: this.config.guestUsersClientSecret,
              audience: this.config.audience,
              grant_type: 'client_credentials',
            })
            .pipe(
              delayWhen((data) => this.cacheManager.set(this.systemTokenKey, data.data.access_token, 3.24e7)),
              map((data) => data.data.access_token),
            ),
        ),
      ),
    );
  }

  enableUser(identityUserId: string): Observable<void> {
    return of(identityUserId).pipe(
      mergeMap((id) => this.management.users.update({ id }, { blocked: false })),
      mapToVoid(),
    );
  }

  disableUser(identityUserId: string): Observable<void> {
    return of(identityUserId).pipe(
      mergeMap((id) => this.management.users.update({ id }, { blocked: true })),
      mapToVoid(),
    );
  }

  getUserIdByEmail(email: string): Observable<Nullable<string>> {
    return of(email).pipe(
      mergeMap((email) => this.management.usersByEmail.getByEmail({ email })),
      map((response) => response.data.at(0)),
      map((data) => data?.user_id ?? null),
    );
  }

  createUser(user: User, password: string, roles: string[], tenants: string[]): Observable<void> {
    return of({}).pipe(
      mergeMap(() =>
        this.management.users
          .create({
            email: user.email,
            password: password,
            connection: 'Username-Password-Authentication',
            app_metadata: {
              tenants: tenants,
              user: user.id.toString(),
            },
          })
          .then((data) => data.data.user_id),
      ),
      delayWhen((userId: string) => this.management.users.assignRoles({ id: userId }, { roles })),
      mapToVoid(),
    );
  }

  updateTenants(identityUserId: string, user: User): Observable<void> {
    return of(identityUserId).pipe(
      mergeMap((id) =>
        this.management.users.update(
          { id },
          {
            app_metadata: {
              user: user.id.toString(),
              tenants: user.tenants,
            },
          },
        ),
      ),
      mapToVoid(),
    );
  }

  addRole(identityUserId: string, role: string): Observable<void> {
    return of(identityUserId).pipe(
      mergeMap((identityUserId) => this.management.users.assignRoles({ id: identityUserId }, { roles: [role] })),
      mapToVoid(),
    );
  }

  removeRole(identityUserId: string, role: string): Observable<void> {
    return of(identityUserId).pipe(
      mergeMap((identityUserId) => this.management.users.deleteRoles({ id: identityUserId }, { roles: [role] })),
      mapToVoid(),
    );
  }

  getRoles(): Observable<Role[]> {
    return from(this.management.roles.getAll()).pipe(map((response) => response.data));
  }
}
