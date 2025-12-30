import { Result } from '@internal/common';

export class GetIndustriesQuery {
  static create(): Result<GetIndustriesQuery> {
    return Result.ok(new GetIndustriesQuery());
  }
}
