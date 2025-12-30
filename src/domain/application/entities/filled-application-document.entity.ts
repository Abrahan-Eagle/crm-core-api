import { Nullable, OptionalValue, Result, Validator } from '@internal/common';

import { BufferFile, DomainErrorCode, Id } from '../../common';

export class FilledApplicationDocument {
  constructor(
    public readonly name: string,
    public readonly file: Nullable<BufferFile>,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    name: OptionalValue<string>,
    file: Nullable<BufferFile>,
  ): Result<FilledApplicationDocument> {
    return Result.combine({
      applicationId: this.validateApplicationId(applicationId),
      name: this.validateName(name),
    }).map(({ applicationId, name }) => {
      const fileName = `${applicationId.toString()}/${name}`;

      return new FilledApplicationDocument(fileName, file);
    });
  }

  static validateApplicationId(applicationId: OptionalValue<string>): Result<Id> {
    return Id.create(
      applicationId,
      () => DomainErrorCode.APPLICATION_ID_EMPTY,
      () => DomainErrorCode.APPLICATION_ID_INVALID,
    );
  }

  static validateName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => DomainErrorCode.APPLICATION_DOCUMENT_NAME_EMPTY)
      .string(() => DomainErrorCode.APPLICATION_DOCUMENT_NAME_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.APPLICATION_DOCUMENT_NAME_EMPTY);
  }
}
