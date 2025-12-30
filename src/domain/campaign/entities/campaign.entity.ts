import { BadRequest, Nullable, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class Campaign {
  constructor(
    public readonly id: Id,
    public readonly sender: string,
    public readonly subject: string,
    public readonly message: string,
    public readonly contacts: number,
    private _jobId: Nullable<string>,
  ) {}

  public get jobId() {
    return this._jobId;
  }

  static create(
    id: Id,
    sender: OptionalValue<string>,
    subject: OptionalValue<string>,
    message: OptionalValue<string>,
    contacts: OptionalValue<number>,
  ): Result<Campaign> {
    return Result.combine([
      Result.ok(id),
      this.validateSender(sender),
      this.validateSubject(subject),
      this.validateMessage(message),
      this.validateContacts(contacts),
    ]).map((params) => new Campaign(...params, null));
  }

  static validateSender(sender: OptionalValue<string>): Result<string> {
    return Validator.of(sender)
      .required(() => new BadRequest(DomainErrorCode.CAMPAIGN_SENDER_EMPTY))
      .email(() => new BadRequest(DomainErrorCode.CAMPAIGN_SENDER_INVALID));
  }

  static validateSubject(subject: OptionalValue<string>): Result<string> {
    return Validator.of(subject)
      .required(() => new BadRequest(DomainErrorCode.CAMPAIGN_SUBJECT_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.CAMPAIGN_SUBJECT_INVALID))
      .maxLength(100, () => new BadRequest(DomainErrorCode.CAMPAIGN_SUBJECT_TOO_LONG));
  }

  static validateMessage(message: OptionalValue<string>): Result<string> {
    return Validator.of(message)
      .required(() => new BadRequest(DomainErrorCode.CAMPAIGN_MESSAGE_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.CAMPAIGN_MESSAGE_INVALID))
      .maxLength(2500, () => new BadRequest(DomainErrorCode.CAMPAIGN_MESSAGE_TOO_LONG));
  }

  static validateContacts(contacts: OptionalValue<number>): Result<number> {
    return Validator.of(contacts)
      .required(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACTS_EMPTY))
      .number(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACTS_INVALID))
      .min(1, () => new BadRequest(DomainErrorCode.CAMPAIGN_NO_CONTACTS));
  }

  public stopCampaign(): Result<void> {
    return Result.ok().onSuccess(() => {
      this._jobId = null;
    });
  }

  public startCampaign(jobId: string): Result<void> {
    return Result.ok().onSuccess(() => {
      this._jobId = jobId;
    });
  }
}
