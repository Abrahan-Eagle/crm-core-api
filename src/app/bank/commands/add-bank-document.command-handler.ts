import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, Observable, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { AddBankDocumentCommand, BankRepository } from '@/domain/bank';
import { Bank } from '@/domain/bank/entities';
import { StorageRepository } from '@/domain/media';

@CommandHandler(AddBankDocumentCommand)
export class AddBankDocumentCommandHandler extends BaseCommandHandler<AddBankDocumentCommand, void> {
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

  handle(command: AddBankDocumentCommand): Observable<void> {
    const { id, file } = command;
    return this.repository.findById(id).pipe(
      throwIfVoid(() => NotFound.of(Bank, id.toString())),
      validateIf(
        (bank) => bank.isActive(),
        () => NotFound.of(Bank, id.toString()),
      ),
      tap<Bank>((bank) => bank.addDocument(file).getOrThrow()),
      delayWhen((bank: Bank) =>
        this.transactionService.runInTransaction(() =>
          zip(this.repository.updateOne(bank), this.storage.saveFile(file, ENTITY_MEDIA_TYPE.BANK)),
        ),
      ),
      mapToVoid(),
    );
  }
}
