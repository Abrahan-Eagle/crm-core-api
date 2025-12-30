import { BaseQueryHandler, QueryHandler } from '@internal/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { GetLastApplicationPeriodQuery } from '@/domain/application';
import { ApplicationDocument } from '@/infra/adapters';
import { ExtendedAuthContextStorage } from '@/infra/common';

@QueryHandler(GetLastApplicationPeriodQuery)
export class GetLastApplicationPeriodQueryHandler extends BaseQueryHandler<
  GetLastApplicationPeriodQuery,
  string | null
> {
  constructor(
    @InjectModel(InjectionConstant.APPLICATION_MODEL)
    private readonly model: Model<ApplicationDocument>,
    private readonly context: ExtendedAuthContextStorage,
  ) {
    super();
  }

  handle(query: GetLastApplicationPeriodQuery): Observable<string | null> {
    return of(query).pipe(
      mergeMap(({ companyId }) =>
        this.model
          .aggregate<ApplicationDocument>()
          .match({
            company_id: new Types.ObjectId(companyId.toString()),
            tenant_id: this.context.store.tenantId.toString(),
          })
          .sort({ created_at: -1 })
          .limit(1)
          .exec(),
      ),
      map(([doc]) => doc?.period ?? null),
    );
  }
}
