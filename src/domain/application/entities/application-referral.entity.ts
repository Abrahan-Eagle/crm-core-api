import { Nullable, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id, REFERRAL_SOURCES } from '../../common';

export class ApplicationReferral {
  constructor(
    public readonly source: string,
    public readonly reference: Nullable<string>,
  ) {}

  static create(source: OptionalValue<string>, reference: OptionalValue<string>): Result<ApplicationReferral> {
    return Result.combine([this.validateSource(source), this.validateReference(reference)]).map(
      (params) => new ApplicationReferral(...params),
    );
  }

  static validateApplicationId(applicationId: string): Result<Id> {
    return Id.create(
      applicationId,
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    );
  }

  static validateSource(source: OptionalValue<string>): Result<string> {
    return Validator.of(source)
      .required(() => DomainErrorCode.APPLICATION_REFERRAL_SOURCE_EMPTY)
      .string(() => DomainErrorCode.APPLICATION_REFERRAL_SOURCE_INVALID)
      .map((value) => value.trim())
      .enum(REFERRAL_SOURCES, () => DomainErrorCode.APPLICATION_REFERRAL_SOURCE_INVALID)
      .notEmpty(() => DomainErrorCode.APPLICATION_REFERRAL_SOURCE_EMPTY);
  }

  static validateReference(reference: OptionalValue<string>): Result<Nullable<string>> {
    return Validator.of(reference)
      .map((value) => (value ? value : null))
      .mapIfAbsent(() => null)
      .mapIfPresent((reference) =>
        Validator.of(reference)
          .required(() => DomainErrorCode.APPLICATION_REFERRAL_REFERENCE_EMPTY)
          .string(() => DomainErrorCode.APPLICATION_REFERRAL_REFERENCE_INVALID)
          .map((value) => value.trim())
          .notEmpty(() => DomainErrorCode.APPLICATION_REFERRAL_REFERENCE_EMPTY)
          .getOrThrow(),
      );
  }
}
