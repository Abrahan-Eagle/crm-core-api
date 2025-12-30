import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class DeleteBankDocumentCommand {
  private constructor(
    public readonly bankId: Id,
    public readonly documentId: Id,
  ) {}

  static create(bankId: OptionalValue<string>, documentId: OptionalValue<string>): Result<DeleteBankDocumentCommand> {
    return Result.combine([
      Id.create(
        bankId,
        () => DomainErrorCode.BANK_ID_EMPTY,
        () => DomainErrorCode.BANK_ID_INVALID,
      ),
      Id.create(
        documentId,
        () => DomainErrorCode.DOCUMENT_ID_EMPTY,
        () => DomainErrorCode.DOCUMENT_ID_INVALID,
      ),
    ]).map((params) => new DeleteBankDocumentCommand(...params));
  }
}
