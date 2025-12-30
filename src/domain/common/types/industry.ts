import { BadRequest, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode } from '@/domain/common';

export class Industry {
  protected constructor(public readonly name: string) {}

  get id(): string {
    return this.name
      .toLowerCase()
      .replace(/\s/g, '-')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  static create(name: OptionalValue<string>): Result<Industry> {
    return this.validateName(name).map((name) => new Industry(name));
  }

  static validateName(variety: OptionalValue<string>): Result<string> {
    return Validator.of(variety)
      .required(() => new BadRequest(DomainErrorCode.INDUSTRY_EMPTY))
      .string(() => new BadRequest(DomainErrorCode.INDUSTRY_INVALID))
      .map((variety) => variety.trim())
      .minLength(2, () => new BadRequest(DomainErrorCode.INDUSTRY_TOO_SHORT))
      .maxLength(80, () => new BadRequest(DomainErrorCode.INDUSTRY_TOO_LONG));
  }
}
