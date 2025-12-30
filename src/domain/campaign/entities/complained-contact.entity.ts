import { BadRequest, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '@/domain/common';

export enum COMPLAINT_TYPE {
  COMPLAINT = 'Complaint',
  BOUNCE = 'Bounce',
}

export class ComplainedContact {
  constructor(
    public readonly type: COMPLAINT_TYPE,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {}

  static create(
    type: OptionalValue<string>,
    email: OptionalValue<string>,
    createdAt: OptionalValue<string>,
  ): Result<ComplainedContact> {
    return Result.combine([this.validateType(type), this.validateEmail(email), this.validateCreatedAt(createdAt)]).map(
      (params) => new ComplainedContact(...params),
    );
  }

  static validateEmail(email: OptionalValue<string>): Result<string> {
    return Validator.of(email)
      .required(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_EMAIL_EMPTY))
      .email(() => new BadRequest(DomainErrorCode.CAMPAIGN_CONTACT_EMAIL_INVALID));
  }

  static validateType(type: OptionalValue<string>): Result<COMPLAINT_TYPE> {
    return Validator.of(type)
      .required(() => DomainErrorCode.COMPLAINT_TYPE_EMPTY)
      .enum(COMPLAINT_TYPE, () => DomainErrorCode.COMPLAINT_TYPE_INVALID);
  }

  static validateCreatedAt(createdAt: OptionalValue<string>): Result<Date> {
    return Validator.of(createdAt)
      .required(() => DomainErrorCode.COMPLAINT_DATE_EMPTY)
      .datetime(() => DomainErrorCode.COMPLAINT_DATE_INVALID);
  }
}
