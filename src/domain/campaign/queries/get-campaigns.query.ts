import { Result } from '@internal/common';

export class GetCampaignsQuery {
  private constructor() {}

  static create(): Result<GetCampaignsQuery> {
    return Result.ok(new GetCampaignsQuery());
  }
}
