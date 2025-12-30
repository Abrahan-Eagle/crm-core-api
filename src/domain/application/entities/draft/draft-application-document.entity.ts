import { Nullable, OptionalValue, Result } from '@internal/common';
import { extname } from 'path';

import { BufferFile, Id } from '@/domain/common';
import { normalizeFileName } from '@/domain/common/utils';

import { ApplicationDocument } from '../application-document.entity';

interface UpdateDraftDocumentParams {
  amount?: OptionalValue<number>;
  transactions?: OptionalValue<number>;
  negativeDays?: OptionalValue<number>;
}

export class DraftApplicationDocument {
  constructor(
    public readonly name: string,
    private _amount: Nullable<number>,
    private _transactions: Nullable<number>,
    private _negativeDays: Nullable<number>,
    public readonly period: string,
    public readonly file: Nullable<BufferFile>,
  ) {}

  public isValid(): boolean {
    return this._amount !== null && this._transactions !== null && this.negativeDays !== null;
  }

  get amount(): Nullable<number> {
    return this._amount;
  }

  get transactions(): Nullable<number> {
    return this._transactions;
  }

  get negativeDays(): Nullable<number> {
    return this._negativeDays;
  }

  static create(
    applicationId: Id,
    name: OptionalValue<string>,
    period: OptionalValue<string>,
    file: Express.Multer.File,
  ): Result<DraftApplicationDocument> {
    return Result.combine([ApplicationDocument.validateName(name), ApplicationDocument.validatePeriod(period)]).map(
      ([name, period]) => {
        const fileName = `${applicationId.toString()}/${normalizeFileName(name)}`;
        return new DraftApplicationDocument(
          fileName,
          null,
          null,
          null,
          period,
          new BufferFile(
            `${applicationId.toString()}/${normalizeFileName(
              Buffer.from(file.originalname, 'latin1').toString('utf8'),
            )}`,
            file.buffer,
            extname(file.originalname),
            file.mimetype,
          ),
        );
      },
    );
  }

  public update(update: UpdateDraftDocumentParams): Result<void> {
    return Result.combine([
      update?.amount !== undefined ? this.updateAmount(update.amount) : Result.ok(),
      update?.transactions !== undefined ? this.updateTransactions(update.transactions) : Result.ok(),
      update?.negativeDays !== undefined ? this.updateNegativeDays(update.negativeDays) : Result.ok(),
    ]).flatMap(() => Result.ok());
  }

  public updateAmount(amount: OptionalValue<number>): Result<void> {
    return ApplicationDocument.validateAmount(amount)
      .onSuccess((validated) => {
        this._amount = validated;
      })
      .flatMap(() => Result.ok());
  }

  public updateTransactions(transactions: OptionalValue<number>): Result<void> {
    return ApplicationDocument.validateTransactions(transactions)
      .onSuccess((validated) => {
        this._transactions = validated;
      })
      .flatMap(() => Result.ok());
  }

  public updateNegativeDays(negativeDays: OptionalValue<number>): Result<void> {
    return ApplicationDocument.validateNegativeDays(negativeDays)
      .onSuccess((validated) => {
        this._negativeDays = validated;
      })
      .flatMap(() => Result.ok());
  }
}
