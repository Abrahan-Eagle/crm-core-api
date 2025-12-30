import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, map, Observable, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { Company, CompanyDocument, CompanyRepository, DeleteCompanyDocumentCommand } from '@/domain/company';
import { StorageRepository } from '@/domain/media';

@CommandHandler(DeleteCompanyDocumentCommand)
export class DeleteCompanyDocumentCommandHandler extends BaseCommandHandler<DeleteCompanyDocumentCommand, void> {
  constructor(
    @Inject(InjectionConstant.COMPANY_REPOSITORY)
    private readonly repository: CompanyRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: DeleteCompanyDocumentCommand): Observable<void> {
    const { companyId, documentId } = command;
    return this.repository.findById(companyId).pipe(
      throwIfVoid(() => NotFound.of(Company, companyId.toString())),
      map((company) => ({
        company,
        document: company.documents.find((document) => document.id.equals(documentId)),
      })),
      validateIf(
        ({ document }) => document !== null && document !== undefined,
        () => NotFound.of(CompanyDocument, documentId.toString()),
      ),
      tap(({ company }) => company.removeDocument(documentId).getOrThrow()),
      delayWhen<{ company: Company; document: CompanyDocument }>(({ company, document }) =>
        this.transactionService.runInTransaction(() =>
          zip(this.repository.updateOne(company), this.storage.deleteFile(document.name, ENTITY_MEDIA_TYPE.COMPANY)),
        ),
      ),
      mapToVoid(),
    );
  }
}
