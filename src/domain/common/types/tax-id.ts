import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '../errors';

export class TaxId {
  constructor(private readonly value: string) {}

  static create(value: OptionalValue<string>) {
    return Result.combine([this.validateTaxId(value)]).map((params) => new TaxId(...params));
  }

  toString() {
    return this.value;
  }

  static validateTaxId(value: OptionalValue<string>): Result<string> {
    return Validator.of(value)
      .required(() => DomainErrorCode.TAX_ID_EMPTY)
      .string(() => DomainErrorCode.TAX_ID_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.TAX_ID_EMPTY)
      .regex(/^[0-9]{2}-[0-9]{7}$/, () => DomainErrorCode.TAX_ID_INVALID);
  }
}
