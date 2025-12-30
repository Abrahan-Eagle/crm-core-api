import { OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { ApplicationDocument } from '../entities';

type UpdateDraftDocument = {
  amount: OptionalValue<number>;
  transactions: OptionalValue<number>;
  negative_days: OptionalValue<number>;
  period: OptionalValue<string>;
};

export class UpdateDraftApplicationCommand {
  private constructor(
    public readonly applicationId: Id,
    public readonly statements: {
      amount: number;
      transactions: number;
      negativeDays: number;
      period: string;
    }[],
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    statements: OptionalValue<UpdateDraftDocument[]>,
  ): Result<UpdateDraftApplicationCommand> {
    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      Validator.of(statements)
        .required(() => DomainErrorCode.BANK_STATEMENTS_INVALID)
        .array(() => DomainErrorCode.BANK_STATEMENTS_INVALID)
        .flatMap((statements) =>
          Result.combine(
            statements.map((statement) =>
              Result.combine({
                amount: ApplicationDocument.validateAmount(statement.amount),
                transactions: ApplicationDocument.validateTransactions(statement.transactions),
                negativeDays: ApplicationDocument.validateNegativeDays(statement.negative_days),
                period: ApplicationDocument.validatePeriod(statement.period),
              }),
            ),
          ),
        ),
    ]).map(([id, statements]) => new UpdateDraftApplicationCommand(id, statements));
  }
}
