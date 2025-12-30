import { BaseCommandHandler, CommandHandler, Result } from '@internal/common';
import { TransactionService } from '@internal/mongo';
import { Inject } from '@nestjs/common';
import { delayWhen, map, Observable, of, tap, zip } from 'rxjs';

import { ENTITY_MEDIA_TYPE, InjectionConstant } from '@/app/common';
import { BankRepository, CreateBankCommand } from '@/domain/bank';
import { Bank } from '@/domain/bank/entities';
import { BufferFile, Id } from '@/domain/common';
import { StorageRepository } from '@/domain/media';

@CommandHandler(CreateBankCommand)
export class CreateBankCommandHandler extends BaseCommandHandler<CreateBankCommand, Id> {
  constructor(
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(InjectionConstant.STORAGE_REPOSITORY)
    private readonly storage: StorageRepository,
    @Inject(InjectionConstant.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  handle(command: CreateBankCommand): Observable<Id> {
    return of(command).pipe(
      tap(({ bank, files }) => Result.combine(files.map((file) => bank.addDocument(file))).getOrThrow()),
      delayWhen<{ bank: Bank; files: BufferFile[] }>(({ bank, files }) =>
        this.transactionService.runInTransaction(() =>
          zip(
            this.bankRepository.createOne(bank),
            ...files.map((file) => this.storage.saveFile(file, ENTITY_MEDIA_TYPE.BANK)),
          ),
        ),
      ),
      map(({ bank }) => bank.id),
    );
  }
}
