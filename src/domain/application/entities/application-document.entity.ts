import { Nullable, OptionalValue, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { generateRandomSlug, normalizeFileName } from '@/domain/common/utils';

import { BufferFile, DomainErrorCode, Id } from '../../common';
import { DraftApplicationDocument } from './draft';

export enum StatementDocumentType {
  BANK_STATEMENT = 'bank-statement',
  CREDIT_CARD_STATEMENT = 'credit-card-statement',
  ADDITIONAL_STATEMENT = 'additional-statement',
  MTD_STATEMENT = 'mtd-statement',
}

export class ApplicationDocument {
  constructor(
    public readonly name: string,
    public readonly amount: number,
    public readonly transactions: number,
    public readonly negativeDays: number,
    public readonly period: Nullable<string>,
    public readonly file: Nullable<BufferFile>,
  ) {}

  static create(
    statementType: StatementDocumentType,
    applicationId: OptionalValue<string>,
    name: OptionalValue<string>,
    amount: OptionalValue<number>,
    transactions: OptionalValue<number>,
    negativeDays: OptionalValue<number>,
    file: OptionalValue<Express.Multer.File>,
  ): Result<ApplicationDocument> {
    return Result.combine({
      applicationId: Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ) as Result<Id>,
      name: this.validateName(name),
      amount: this.validateAmount(amount),
      transactions: this.validateTransactions(transactions),
      negativeDays: this.validateNegativeDays(negativeDays),
    }).map(({ applicationId, name, amount, transactions, negativeDays }) => {
      const fileResult = Validator.of(file)
        .required(() => DomainErrorCode.FILE_PATH_EMPTY)
        .map((file) => {
          const extension = extname(file.originalname);
          let filename: string;

          switch (statementType) {
            case StatementDocumentType.MTD_STATEMENT:
              filename = `${statementType}${extension}`;
              break;
            case StatementDocumentType.ADDITIONAL_STATEMENT:
              const randomSlug = generateRandomSlug();
              filename = `${statementType}-${randomSlug}${extension}`;
              break;
            default:
              filename = `${normalizeFileName(name)}${extension}`;
          }

          return new BufferFile(`${applicationId.toString()}/${filename}`, file.buffer, extension, file.mimetype);
        })
        .getOrThrow();

      return new ApplicationDocument(fileResult.name, amount, transactions, negativeDays, null, fileResult);
    });
  }

  static createFromDraft(draft: DraftApplicationDocument): ApplicationDocument {
    return new ApplicationDocument(
      draft.name,
      draft.amount!,
      draft.transactions!,
      draft.negativeDays!,
      draft.period!,
      null,
    );
  }

  static createWithPeriod(
    statementType: StatementDocumentType,
    applicationId: OptionalValue<string>,
    name: OptionalValue<string>,
    amount: OptionalValue<number>,
    transactions: OptionalValue<number>,
    negativeDays: OptionalValue<number>,
    period: OptionalValue<string>,
    file: OptionalValue<Express.Multer.File>,
  ): Result<ApplicationDocument> {
    return Result.combine({
      applicationId: Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ) as Result<Id>,
      name: this.validateName(name),
      amount: this.validateAmount(amount),
      transactions: this.validateTransactions(transactions),
      negativeDays: this.validateNegativeDays(negativeDays),
      period: this.validatePeriod(period),
    }).map(({ applicationId, amount, transactions, negativeDays, period }) => {
      const fileResult = Validator.of(file)
        .required(() => DomainErrorCode.FILE_PATH_EMPTY)
        .map((file) => {
          const extension = extname(file.originalname);
          const filename = `${statementType}-${period}${extension}`;
          return new BufferFile(`${applicationId.toString()}/${filename}`, file.buffer, extension, file.mimetype);
        })
        .getOrThrow();

      const extension = extname(fileResult.name);
      const fileName = `${applicationId.toString()}/${statementType}-${period}${extension}`;

      return new ApplicationDocument(fileName, amount, transactions, negativeDays, period, fileResult);
    });
  }

  static validateName(name: OptionalValue<string>): Result<string> {
    return Validator.of(name)
      .required(() => DomainErrorCode.APPLICATION_DOCUMENT_NAME_EMPTY)
      .string(() => DomainErrorCode.APPLICATION_DOCUMENT_NAME_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.APPLICATION_DOCUMENT_NAME_EMPTY);
  }

  static validateAmount(amount: OptionalValue<number>): Result<number> {
    return Validator.of(amount)
      .required(() => DomainErrorCode.APPLICATION_DOCUMENT_AMOUNT_EMPTY)
      .number(() => DomainErrorCode.APPLICATION_DOCUMENT_AMOUNT_INVALID)
      .min(0, () => DomainErrorCode.APPLICATION_DOCUMENT_AMOUNT_INVALID);
  }

  static validateTransactions(transactions: OptionalValue<number>): Result<number> {
    return Validator.of(transactions)
      .required(() => DomainErrorCode.APPLICATION_DOCUMENT_TRANSACTIONS_EMPTY)
      .number(() => DomainErrorCode.APPLICATION_DOCUMENT_TRANSACTIONS_INVALID)
      .min(0, () => DomainErrorCode.APPLICATION_DOCUMENT_TRANSACTIONS_INVALID);
  }

  static validateNegativeDays(negativeDays: OptionalValue<number>): Result<number> {
    return Validator.of(negativeDays)
      .required(() => DomainErrorCode.APPLICATION_DOCUMENT_NEGATIVE_DAYS_EMPTY)
      .number(() => DomainErrorCode.APPLICATION_DOCUMENT_NEGATIVE_DAYS_INVALID)
      .min(0, () => DomainErrorCode.APPLICATION_DOCUMENT_NEGATIVE_DAYS_INVALID);
  }

  static validatePeriod(period: OptionalValue<string>): Result<string> {
    return Validator.of(period)
      .required(() => DomainErrorCode.APPLICATION_DOCUMENT_PERIOD_EMPTY)
      .string(() => DomainErrorCode.APPLICATION_DOCUMENT_PERIOD_INVALID)
      .map((value) => value.trim())
      .notEmpty(() => DomainErrorCode.APPLICATION_DOCUMENT_PERIOD_EMPTY)
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, () => DomainErrorCode.APPLICATION_DOCUMENT_PERIOD_INVALID);
  }
}
