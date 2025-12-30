import { OptionalValue, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { BufferFile, DomainErrorCode, generateDocumentFilename, Id } from '@/domain/common';
import { SUPPORTED_COMPANY_FILES } from '@/domain/company';

export class AddCompanyDocumentCommand {
  private constructor(
    public readonly id: Id,
    public readonly file: BufferFile,
    public readonly type: SUPPORTED_COMPANY_FILES,
  ) {}

  static create(
    id: OptionalValue<string>,
    file: OptionalValue<Express.Multer.File>,
    type: OptionalValue<string>,
  ): Result<AddCompanyDocumentCommand> {
    return Id.create(
      id,
      () => DomainErrorCode.COMPANY_ID_EMPTY,
      () => DomainErrorCode.COMPANY_ID_INVALID,
    ).flatMap((id) =>
      Result.combine([
        Result.ok(id),
        Validator.of(type)
          .required(() => DomainErrorCode.COMPANY_FILE_TYPE_EMPTY)
          .string(() => DomainErrorCode.COMPANY_FILE_TYPE_INVALID)
          .map((type) => type.trim().toUpperCase())
          .enum(SUPPORTED_COMPANY_FILES, () => DomainErrorCode.COMPANY_FILE_TYPE_INVALID),
        Validator.of(file)
          .required(() => DomainErrorCode.FILE_PATH_EMPTY)
          .map((file) => file) as Result<Express.Multer.File>,
      ]).map(([id, type, file]) => {
        const filename = generateDocumentFilename(type, file.originalname);
        const bufferFile = new BufferFile(
          `${id.toString()}/${filename}`,
          file.buffer,
          extname(file.originalname),
          file.mimetype,
        );
        return new AddCompanyDocumentCommand(id, bufferFile, type);
      }),
    );
  }
}
