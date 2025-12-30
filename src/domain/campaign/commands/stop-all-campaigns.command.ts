import { Result } from '@internal/common';

export class StopAllCampaignsCommand {
  public static create(): Result<StopAllCampaignsCommand> {
    return Result.ok(new StopAllCampaignsCommand());
  }
}
