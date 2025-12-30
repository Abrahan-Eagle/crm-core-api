import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export const DOCUMENT_MAX_LENGTH = 120;
export class BankDocument {
  constructor(
    public readonly id: Id,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}

  static create(id: Id, name: OptionalValue<string>): Result<BankDocument> {
    return BankDocument.validateName(name).map((name) => new BankDocument(id, name, new Date()));
  }

  static validateName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => DomainErrorCode.FILE_NAME_EMPTY)
      .string(() => DomainErrorCode.FILE_NAME_INVALID)
      .maxLength(DOCUMENT_MAX_LENGTH, () => DomainErrorCode.FILE_NAME_TOO_LONG);
  }
}
