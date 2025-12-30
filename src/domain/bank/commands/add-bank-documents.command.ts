import { OptionalValue, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { BufferFile, DomainErrorCode, Id } from '@/domain/common';
import { normalizeFileName } from '@/domain/common/utils';

export class AddBankDocumentCommand {
  private constructor(
    public readonly id: Id,
    public readonly file: BufferFile,
  ) {}

  static create(id: OptionalValue<string>, file: OptionalValue<Express.Multer.File>): Result<AddBankDocumentCommand> {
    return Id.create(
      id,
      () => DomainErrorCode.BANK_ID_EMPTY,
      () => DomainErrorCode.BANK_ID_INVALID,
    )
      .flatMap((id) =>
        Result.combine([
          Result.ok(id),
          Validator.of(file)
            .required(() => DomainErrorCode.FILE_PATH_EMPTY)
            .map(
              (file) =>
                new BufferFile(
                  `${id.toString()}/${normalizeFileName(Buffer.from(file.originalname, 'latin1').toString('utf8'))}`,
                  file.buffer,
                  extname(file.originalname),
                  file.mimetype,
                ),
            ) as Result<BufferFile>,
        ]),
      )
      .map((params) => new AddBankDocumentCommand(...params));
  }
}
