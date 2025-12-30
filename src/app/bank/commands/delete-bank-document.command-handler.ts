import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, map, Observable, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { Bank, BankDocument, BankRepository, DeleteBankDocumentCommand } from '@/domain/bank';
import { StorageRepository } from '@/domain/media';

@CommandHandler(DeleteBankDocumentCommand)
export class DeleteBankDocumentCommandHandler extends BaseCommandHandler<DeleteBankDocumentCommand, void> {
  constructor(
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly repository: BankRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: DeleteBankDocumentCommand): Observable<void> {
    const { bankId, documentId } = command;
    return this.repository.findById(bankId).pipe(
      throwIfVoid(() => NotFound.of(Bank, bankId.toString())),
      validateIf(
        (bank) => bank.isActive(),
        () => NotFound.of(Bank, bankId.toString()),
      ),
      map((bank) => ({
        bank,
        document: bank.documents.find((document) => document.id.equals(documentId)),
      })),
      validateIf(
        ({ document }) => document !== null && document !== undefined,
        () => NotFound.of(BankDocument, documentId.toString()),
      ),
      tap(({ bank }) => bank.removeDocument(documentId).getOrThrow()),
      delayWhen<{ bank: Bank; document: BankDocument }>(({ bank, document }) =>
        this.transactionService.runInTransaction(() =>
          zip(this.repository.updateOne(bank), this.storage.deleteFile(document.name, ENTITY_MEDIA_TYPE.BANK)),
        ),
      ),
      mapToVoid(),
    );
  }
}
