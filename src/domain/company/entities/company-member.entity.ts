import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

const COMPANY_MEMBER_TITLE_MIN_LENGTH = 2;
const COMPANY_MEMBER_TITLE_MAX_LENGTH = 100;
export class CompanyMember {
  constructor(
    public readonly contactId: Id,
    public readonly title: string,
    public readonly percentage: number,
    public readonly memberSince: Date,
  ) {}

  static create(
    contact_id: Id,
    title: OptionalValue<string>,
    percentage: OptionalValue<number>,
    memberSince: OptionalValue<string>,
  ): Result<CompanyMember> {
    return Result.combine([
      CompanyMember.validateTitle(title),
      CompanyMember.validatePercentage(percentage),
      CompanyMember.validateMemberSince(memberSince),
    ]).map((params) => new CompanyMember(contact_id, ...params));
  }

  static validateTitle(title: OptionalValue<string>): Result<string> {
    return Validator.of(title)
      .required(() => DomainErrorCode.COMPANY_MEMBER_TITLE_EMPTY)
      .string(() => DomainErrorCode.COMPANY_MEMBER_TITLE_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.COMPANY_MEMBER_TITLE_EMPTY)
      .minLength(COMPANY_MEMBER_TITLE_MIN_LENGTH, () => DomainErrorCode.COMPANY_MEMBER_TITLE_TOO_SHORT)
      .maxLength(COMPANY_MEMBER_TITLE_MAX_LENGTH, () => DomainErrorCode.COMPANY_MEMBER_TITLE_TOO_LONG);
  }

  static validatePercentage(percentage: OptionalValue<number>): Result<number> {
    return Validator.of(percentage)
      .required(() => DomainErrorCode.COMPANY_MEMBER_PERCENTAGE_EMPTY)
      .number(() => DomainErrorCode.COMPANY_MEMBER_PERCENTAGE_INVALID)
      .validate(
        (value) => value >= 0 && value <= 100,
        () => DomainErrorCode.COMPANY_MEMBER_PERCENTAGE_OUT_OF_RANGE,
      );
  }

  static validateMemberSince(memberSince: OptionalValue<string | Date>): Result<Date> {
    return Validator.of(memberSince)
      .required(() => DomainErrorCode.COMPANY_MEMBER_SINCE_EMPTY)
      .notEmpty(() => DomainErrorCode.COMPANY_MEMBER_SINCE_EMPTY)
      .datetime(() => DomainErrorCode.COMPANY_MEMBER_SINCE_INVALID)
      .beforeDate(new Date(), () => DomainErrorCode.COMPANY_MEMBER_SINCE_FUTURE);
  }
}
