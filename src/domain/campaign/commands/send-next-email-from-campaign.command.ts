import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class SendNextEmailFromCampaignCommand {
  private constructor(public readonly campaignId: Id) {}

  public static create(id: OptionalValue<string>): Result<SendNextEmailFromCampaignCommand> {
    return Id.create(
      id,
      () => DomainErrorCode.CAMPAIGN_ID_EMPTY,
      () => DomainErrorCode.CAMPAIGN_ID_INVALID,
    ).map((id) => new SendNextEmailFromCampaignCommand(id));
  }
}
