import { Result } from '@internal/common';

export class GetDashboardQuery {
  static create(): Result<GetDashboardQuery> {
    return Result.ok(new GetDashboardQuery());
  }
}
