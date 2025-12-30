import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export enum SUPPORTED_COMPANY_FILES {
  EIN = 'EIN',
  W9 = 'W9',
  VOIDED_CHECK = 'VOIDED_CHECK',
  OPEN_COMPANY_LETTER = 'OPEN_COMPANY_LETTER',
  TAXES = 'TAXES',
  OTHER = 'OTHER',
}

export const DOCUMENT_MAX_LENGTH = 120;

export class CompanyDocument {
  constructor(
    public readonly id: Id,
    public readonly name: string,
    public readonly type: SUPPORTED_COMPANY_FILES,
    public readonly createdAt: Date,
  ) {}

  static create(id: Id, name: OptionalValue<string>, type: OptionalValue<string>): Result<CompanyDocument> {
    return Result.combine([CompanyDocument.validateName(name), CompanyDocument.validateType(type)]).map(
      ([name, type]) => new CompanyDocument(id, name, type, new Date()),
    );
  }

  static validateName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => DomainErrorCode.FILE_NAME_EMPTY)
      .string(() => DomainErrorCode.FILE_NAME_INVALID)
      .maxLength(DOCUMENT_MAX_LENGTH, () => DomainErrorCode.FILE_NAME_TOO_LONG);
  }

  static validateType(type: OptionalValue<string>): Result<SUPPORTED_COMPANY_FILES> {
    return Validator.of(type)
      .required(() => DomainErrorCode.COMPANY_FILE_TYPE_EMPTY)
      .string(() => DomainErrorCode.COMPANY_FILE_TYPE_INVALID)
      .map((type) => type.trim())
      .enum(SUPPORTED_COMPANY_FILES, () => DomainErrorCode.COMPANY_FILE_TYPE_INVALID);
  }
}
