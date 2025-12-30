import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, Observable, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { extractFilename } from '@/domain/common/utils';
import { AddCompanyDocumentCommand, CompanyRepository } from '@/domain/company';
import { Company } from '@/domain/company/entities';
import { StorageRepository } from '@/domain/media';

@CommandHandler(AddCompanyDocumentCommand)
export class AddCompanyDocumentCommandHandler extends BaseCommandHandler<AddCompanyDocumentCommand, void> {
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

  handle(command: AddCompanyDocumentCommand): Observable<void> {
    const { id, file, type } = command;
    const documentName = extractFilename(file.name);
    return this.repository.findById(id).pipe(
      throwIfVoid(() => NotFound.of(Company, id.toString())),
      tap<Company>((company) => company.addDocument(file, type, documentName).getOrThrow()),
      delayWhen((company: Company) =>
        this.transactionService.runInTransaction(() =>
          zip(this.repository.updateOne(company), this.storage.saveFile(file, ENTITY_MEDIA_TYPE.COMPANY)),
        ),
      ),
      mapToVoid(),
    );
  }
}
