import { BaseCommandHandler, CommandHandler, mapToVoid, NotFound, throwIfVoid, validateIf } from '@internal/common';
import { Inject } from '@nestjs/common';
import { mergeMap, Observable, tap } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { Bank, BankRepository, UpdateBankCommand } from '@/domain/bank';

@CommandHandler(UpdateBankCommand)
export class UpdateBankCommandHandler extends BaseCommandHandler<UpdateBankCommand, void> {
  constructor(
    @Inject(InjectionConstant.BANK_REPOSITORY)
    private readonly repository: BankRepository,
  ) {
    super();
  }

  handle(command: UpdateBankCommand): Observable<void> {
    const { bankId } = command;
    return this.repository.findById(bankId).pipe(
      throwIfVoid(() => NotFound.of(Bank, bankId.toString())),
      validateIf(
        (bank) => bank.isActive(),
        () => NotFound.of(Bank, bankId.toString()),
      ),
      tap<Bank>((bank) => this.updateFields(command, bank)),
      mergeMap((bank) => this.repository.updateOne(bank)),
      mapToVoid(),
    );
  }

  private updateFields(command: UpdateBankCommand, bank: Bank) {
    bank.updateBank({
      ...command,
      constraints: bank.constraints
        .copyWith({
          classifications: command.classifications,
          territories: command.territories,
          deposits: command.deposits,
          loanLimit: command.loanLimit,
          hasLoanLimit: command.hasLoanLimit,
          minimumLoan: command.minimumLoan,
          minimumMonthsInBusiness: command.minimumMonthsInBusiness,
          minimumDailyBalance: command.minimumDailyBalance,
          maximumNegativeDays: command.maximumNegativeDays,
          allowedIndustries: command.allowedIndustries,
          supportedIDs: command.supportedIDs,
          positions: command.positions,
          blockedProducts: command.blockedProducts,
        })
        .getOrThrow(),
    });
  }
}
