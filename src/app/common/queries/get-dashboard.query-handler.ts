import { BaseQueryHandler, QueryHandler } from '@internal/common';
import jwt from 'jsonwebtoken';
import { map, Observable, of } from 'rxjs';

import { GetDashboardQuery } from '@/domain/common';
import { ExtendedAuthContextStorage } from '@/infra/common';

import { DashboardConfig } from '../config';

@QueryHandler(GetDashboardQuery)
export class GetDashboardQueryHandler extends BaseQueryHandler<GetDashboardQuery, string> {
  constructor(
    private readonly config: DashboardConfig,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(): Observable<string> {
    return of({
      resource: { dashboard: 3 },
      params: {
        tenant: [this.context.store.tenantId],
      },
      exp: Math.round(Date.now() / 1000) + 15 * 60,
    }).pipe(
      map((payload) => jwt.sign(payload, this.config.apiKey)),
      map((token) => this.config.baseUrl + '/embed/dashboard/' + token + '#bordered=true&titled=true'),
    );
  }
}
