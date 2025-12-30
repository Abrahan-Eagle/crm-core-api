import { OptionalValue, Result } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

export class DeleteCompanyDocumentCommand {
  private constructor(
    public readonly companyId: Id,
    public readonly documentId: Id,
  ) {}

  static create(
    companyId: OptionalValue<string>,
    documentId: OptionalValue<string>,
  ): Result<DeleteCompanyDocumentCommand> {
    return Result.combine([
      Id.create(
        companyId,
        () => DomainErrorCode.COMPANY_ID_EMPTY,
        () => DomainErrorCode.COMPANY_ID_INVALID,
      ),
      Id.create(
        documentId,
        () => DomainErrorCode.DOCUMENT_ID_EMPTY,
        () => DomainErrorCode.DOCUMENT_ID_INVALID,
      ),
    ]).map((params) => new DeleteCompanyDocumentCommand(...params));
  }
}
