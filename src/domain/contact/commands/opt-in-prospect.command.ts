import { Email, Nullable, OptionalValue, Phone, Result, Validator } from '@internal/common';

import { Application, ApplicationReferral } from '@/domain/application';
import { DomainErrorCode } from '@/domain/common';

import { Contact } from '../entities';

interface CreatePhoneRequest {
  intlPrefix: OptionalValue<string>;
  regionCode: OptionalValue<string>;
  number: OptionalValue<string>;
}

type ApplicationReferralRequest = {
  source: string;
  reference: Nullable<string>;
};

export class OptInProspectCommand {
  private constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: Phone,
    public readonly email: Email,
    public readonly loanAmount: number,
    public readonly audience: string,
    public readonly lang: string,
    public readonly referral: Nullable<ApplicationReferral>,
  ) {}

  static create(
    firstName: OptionalValue<string>,
    lastName: OptionalValue<string>,
    phone: OptionalValue<CreatePhoneRequest>,
    email: OptionalValue<string>,
    loanAmount: OptionalValue<number>,
    audience: OptionalValue<string>,
    lang: OptionalValue<string>,
    referral: OptionalValue<ApplicationReferralRequest>,
  ): Result<OptInProspectCommand> {
    return Result.combine([
      Contact.validateFirstName(firstName),
      Contact.validateLastName(lastName),
      Phone.create(phone?.intlPrefix, phone?.regionCode, phone?.number),
      Email.createUnverified(email),
      Application.validateLoanAmount(loanAmount),
      Validator.of(audience)
        .required(() => DomainErrorCode.AUDIENCE_ID_EMPTY)
        .string(() => DomainErrorCode.AUDIENCE_ID_INVALID),
      Validator.of(lang)
        .required(() => DomainErrorCode.LANGUAGE_TAG_ID_EMPTY)
        .string(() => DomainErrorCode.LANGUAGE_TAG_ID_INVALID),
      referral !== undefined
        ? Application.validateReferral(referral).flatMap((referral) =>
            ApplicationReferral.create(referral?.source, referral?.reference),
          )
        : Result.ok(null),
    ]).map((params) => new OptInProspectCommand(...params));
  }
}
