import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class StartCampaignCommand {
  private constructor(public readonly campaignId: Id) {}

  public static create(id: OptionalValue<string>): Result<StartCampaignCommand> {
    return Id.create(
      id,
      () => DomainErrorCode.CAMPAIGN_ID_EMPTY,
      () => DomainErrorCode.CAMPAIGN_ID_INVALID,
    ).map((id) => new StartCampaignCommand(id));
  }
}
