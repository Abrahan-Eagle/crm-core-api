import { BadRequest, Nullable, OptionalValue, Result, Undefinable, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export enum CAMPAIGN_CONTACT_STATUS {
  PENDING = 'PENDING',
  SENDED = 'SENDED',
  ERROR = 'ERROR',
}

export class CampaignContact {
  constructor(
    public readonly contactId: Id,
    public readonly campaignId: Id,
    public readonly email: string,
    public readonly firstName: Nullable<string>,
    public readonly lastName: Nullable<string>,
    private _status: CAMPAIGN_CONTACT_STATUS,
    private _updatedAt?: Date,
    public readonly version?: number,
  ) {}

  get status(): CAMPAIGN_CONTACT_STATUS {
    return this._status;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  static create(
    contactId: Id,
    campaignId: Id,
    email: OptionalValue<string>,
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
  ): Result<CampaignContact> {
    return Result.combine([
      Result.ok(contactId),
      Result.ok(campaignId),
      this.validateEmail(email),
      this.validateFirstName(firstName),
      this.validateLastName(lastName),
    ]).map((params) => new CampaignContact(...params, CAMPAIGN_CONTACT_STATUS.PENDING));
  }

  static validateEmail(email: OptionalValue<string>): Result<string> {
    return Validator.of(email)
      .required(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_EMAIL_EMPTY))
      .email(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_EMAIL_INVALID));
  }

  static validateFirstName(firstName: OptionalValue<string>): Result<Nullable<string>> {
    return Validator.of(firstName)
      .mapIfAbsent(() => null)
      .string(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_FIRST_NAME_INVALID))
      .maxLength(45, () => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_FIRST_NAME_INVALID));
  }

  static validateLastName(lastName: OptionalValue<string>): Result<Nullable<string>> {
    return Validator.of(lastName)
      .mapIfAbsent(() => null)
      .string(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_LAST_NAME_INVALID))
      .maxLength(45, () => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_LAST_NAME_INVALID));
  }

  public markAsSended(): Result<void> {
    return Result.ok().onSuccess(() => {
      this._updatedAt = new Date();
      this._status = CAMPAIGN_CONTACT_STATUS.SENDED;
    });
  }
}
