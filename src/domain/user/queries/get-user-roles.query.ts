import { Result } from '@internal/common';

export class GetUserRolesQuery {
  static create(): Result<GetUserRolesQuery> {
    return Result.ok(new GetUserRolesQuery());
  }
}
