import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Bank, BankRepository, SendBankToBlackListCommand } from '@/domain/bank';

@CommandHandler(SendBankToBlackListCommand)
export class SendBankToBlackListCommandHandler extends BaseCommandHandler<SendBankToBlackListCommand, void> {
  constructor(
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly repository: BankRepository,
  ) {
    super();
  }

  handle(command: SendBankToBlackListCommand): Observable<void> {
    const { bankId, reason } = command;

    return this.repository.findById(bankId).pipe(
      throwIfVoid(() => NotFound.of(Bank, bankId.toString())),
      validateIf(
        (bank) => bank.canBeBlacklisted(),
        () => NotFound.of(Bank, bankId.toString()),
      ),
      tap<Bank>((bank) => bank.setBlacklisted(reason).getOrThrow()),
      mergeMap((bank) => this.repository.updateOne(bank)),
      mapToVoid(),
    );
  }
}
