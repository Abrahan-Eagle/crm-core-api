import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Bank, BankRepository, RemoveFromBlacklistBankCommand } from '@/domain/bank';

@CommandHandler(RemoveFromBlacklistBankCommand)
export class RemoveFromBlacklistBankCommandHandler extends BaseCommandHandler<RemoveFromBlacklistBankCommand, void> {
  constructor(
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly repository: BankRepository,
  ) {
    super();
  }

  handle(command: RemoveFromBlacklistBankCommand): Observable<void> {
    const { bankId } = command;

    return this.repository.findById(bankId).pipe(
      throwIfVoid(() => NotFound.of(Bank, bankId.toString())),
      validateIf(
        (bank) => bank.canBeRemovedFromBlacklist(),
        () => NotFound.of(Bank, bankId.toString()),
      ),
      tap<Bank>((bank) => bank.removeFromBlacklist().getOrThrow()),
      mergeMap((bank) => this.repository.updateOne(bank)),
      mapToVoid(),
    );
  }
}
