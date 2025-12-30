import { BadRequest, OptionalValue, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { BufferFile, DomainErrorCode, Id } from '@/domain/common';
import { generateDocumentFilename } from '@/domain/common/utils';

import { Contact, SUPPORTED_CONTACT_FILES } from '../entities';

export class AddContactDocumentCommand {
  private constructor(
    public readonly contactId: Id,
    public readonly type: SUPPORTED_CONTACT_FILES,
    public readonly file: BufferFile,
  ) {}

  static create(
    contactId: OptionalValue<string>,
    type: OptionalValue<string>,
    file: OptionalValue<Express.Multer.File>,
  ): Result<AddContactDocumentCommand> {
    return Result.combine({
      id: Id.create(
        contactId,
        () => DomainErrorCode.CONTACT_ID_EMPTY,
        () => DomainErrorCode.CONTACT_ID_INVALID,
      ) as Result<Id>,
      type: Validator.of(type)
        .required(() => DomainErrorCode.CONTACT_FILE_TYPE_EMPTY)
        .string(() => DomainErrorCode.CONTACT_FILE_TYPE_INVALID)
        .map((type) => type.toUpperCase())
        .enum(
          SUPPORTED_CONTACT_FILES,
          () => new BadRequest(DomainErrorCode.CONTACT_FILE_TYPE_INVALID),
        ) as Result<SUPPORTED_CONTACT_FILES>,
      fileStream: Validator.of(file).required(() => DomainErrorCode.FILE_PATH_EMPTY) as Result<Express.Multer.File>,
    }).flatMap(({ id, type, fileStream }) => {
      const filename = generateDocumentFilename(type as string, fileStream.originalname);
      return Contact.validateFile(
        new BufferFile(
          `${id.toString()}/${filename}`,
          fileStream.buffer,
          extname(fileStream.originalname),
          fileStream.mimetype,
        ),
      ).map((validatedFile) => new AddContactDocumentCommand(id, type, validatedFile));
    });
  }
}
