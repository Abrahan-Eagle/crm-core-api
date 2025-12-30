import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '@/domain/common';

import { ComplainedContact } from '../entities';

export class CampaignComplaintCommand {
  private constructor(public readonly complainedContact: ComplainedContact[]) {}

  public static create(
    type: OptionalValue<string>,
    emails: OptionalValue<string[]>,
    createdAt: OptionalValue<string>,
  ): Result<CampaignComplaintCommand> {
    return Validator.of(emails)
      .required(() => DomainErrorCode.COMPLAINT_EMAILS_EMPTY)
      .array(() => DomainErrorCode.COMPLAINT_EMAILS_INVALID)
      .flatMap((content) =>
        Result.combine(content.map((contact) => ComplainedContact.create(type, contact, createdAt))),
      )
      .map((contacts) => new CampaignComplaintCommand(contacts));
  }
}
