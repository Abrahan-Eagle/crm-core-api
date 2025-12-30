import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export enum SUPPORTED_CONTACT_FILES {
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  PASSPORT = 'PASSPORT',
  GREEN_CARD_10_YEARS = 'GREEN_CARD_10_YEARS',
  GREEN_CARD_2_YEARS = 'GREEN_CARD_2_YEARS',
  RESTRICTED_DRIVER_LICENSE = 'RESTRICTED_DRIVER_LICENSE',
  WORK_LICENSE = 'WORK_LICENSE',
  ITIN = 'ITIN',
  SSN = 'SSN',
  OTHER = 'OTHER',
}

export const DOCUMENT_MAX_LENGTH = 120;
export class ContactDocument {
  constructor(
    public readonly id: Id,
    public readonly name: string,
    public readonly type: SUPPORTED_CONTACT_FILES,
    public readonly createdAt: Date,
  ) {}

  static create(id: Id, name: OptionalValue<string>, type: OptionalValue<string>): Result<ContactDocument> {
    return Result.combine([ContactDocument.validateName(name), ContactDocument.validateType(type)]).map(
      ([name, type]) => new ContactDocument(id, name, type, new Date()),
    );
  }

  static validateName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => DomainErrorCode.FILE_NAME_EMPTY)
      .string(() => DomainErrorCode.FILE_NAME_INVALID)
      .maxLength(DOCUMENT_MAX_LENGTH, () => DomainErrorCode.FILE_NAME_TOO_LONG);
  }

  static validateType(type: OptionalValue<string>): Result<SUPPORTED_CONTACT_FILES> {
    return Validator.of(type)
      .required(() => DomainErrorCode.CONTACT_FILE_TYPE_EMPTY)
      .string(() => DomainErrorCode.CONTACT_FILE_TYPE_INVALID)
      .map((type) => type.trim())
      .enum(SUPPORTED_CONTACT_FILES, () => DomainErrorCode.CONTACT_FILE_TYPE_INVALID);
  }
}
