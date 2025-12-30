import { Nullable, OptionalValue, Result, Validator } from '@internal/common';

import { DomainErrorCode, Id } from '@/domain/common';

import { Application } from '../entities';
import { ApplicationDocument, StatementDocumentType } from '../entities/application-document.entity';
import { ApplicationReferral } from '../entities/application-referral.entity';

type ApplicationReferralRequest = {
  source: string;
  reference: Nullable<string>;
};

type ApplicationDocumentRequest = {
  name: string;
  amount: number;
  transactions: number;
  negativeDays: number;
  period?: Nullable<string>;
};

export class CreateApplicationCommand {
  private constructor(
    public readonly id: Id,
    public readonly companyId: Id,
    public readonly loanAmount: number,
    public readonly product: string,
    public readonly referral: Nullable<ApplicationReferral>,
    public readonly bankStatements: ApplicationDocument[],
    public readonly mtdStatements: ApplicationDocument[],
    public readonly creditCardStatements: ApplicationDocument[],
    public readonly additionalStatements: ApplicationDocument[],
    public readonly createdBy: Nullable<Id>,
  ) {}

  static create(
    id: Id,
    companyId: OptionalValue<string>,
    loanAmount: number,
    product: string,
    referral: OptionalValue<ApplicationReferralRequest>,
    bankStatements: OptionalValue<ApplicationDocumentRequest[]>,
    mtdStatements: OptionalValue<ApplicationDocumentRequest[]>,
    creditCardStatements: OptionalValue<ApplicationDocumentRequest[]>,
    additionalStatements: OptionalValue<ApplicationDocumentRequest[]>,
    files: OptionalValue<Express.Multer.File[]>,
    userId: Nullable<Id>,
  ): Result<CreateApplicationCommand> {
    const fileResult = Validator.of(files)
      .array(() => DomainErrorCode.COMPANY_DOCUMENTS_INVALID)
      .mapIfAbsent(() => [] as Express.Multer.File[])
      .getOrThrow();

    return Result.combine([
      Result.ok(id),
      Id.create(
        companyId,
        () => DomainErrorCode.APPLICATION_COMPANY_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_COMPANY_ID_INVALID,
      ),
      Application.validateLoanAmount(loanAmount),
      Application.validateProduct(product),
      referral !== null
        ? Application.validateReferral(referral).flatMap((referral) =>
            ApplicationReferral.create(referral?.source, referral?.reference),
          )
        : Result.ok(null),
      Validator.of(bankStatements)
        .required(() => DomainErrorCode.APPLICATION_BANK_STATEMENTS_EMPTY)
        .array(() => DomainErrorCode.APPLICATION_BANK_STATEMENTS_INVALID)
        .flatMap((v) =>
          Result.combine(
            v.map((v) =>
              ApplicationDocument.createWithPeriod(
                StatementDocumentType.BANK_STATEMENT,
                id.toString(),
                v.name,
                v.amount,
                v.transactions,
                v.negativeDays,
                v.period,
                fileResult.find((file) => Buffer.from(file.originalname, 'latin1').toString('utf8') === v.name),
              ),
            ),
          ),
        ),
      Validator.of(mtdStatements)
        .mapIfAbsent(() => [] as ApplicationDocument[])
        .flatMap((statements) =>
          Application.validateMTDStatements(statements).flatMap((v) =>
            Result.combine(
              v.map((v) =>
                ApplicationDocument.create(
                  StatementDocumentType.MTD_STATEMENT,
                  id.toString(),
                  v.name,
                  v.amount,
                  v.transactions,
                  v.negativeDays,
                  fileResult.find((file) => Buffer.from(file.originalname, 'latin1').toString('utf8') === v.name),
                ),
              ),
            ),
          ),
        ),
      Validator.of(creditCardStatements)
        .mapIfAbsent(() => [] as ApplicationDocument[])
        .flatMap((statements) =>
          Application.validateCreditCardStatements(statements).flatMap((v) =>
            Result.combine(
              v.map((v) =>
                ApplicationDocument.createWithPeriod(
                  StatementDocumentType.CREDIT_CARD_STATEMENT,
                  id.toString(),
                  v.name,
                  v.amount,
                  v.transactions,
                  v.negativeDays,
                  v.period,
                  fileResult.find((file) => Buffer.from(file.originalname, 'latin1').toString('utf8') === v.name),
                ),
              ),
            ),
          ),
        ),
      Validator.of(additionalStatements)
        .mapIfAbsent(() => [] as ApplicationDocument[])
        .flatMap((statements) =>
          Application.validateAdditionalStatements(statements).flatMap((v) =>
            Result.combine(
              v.map((v) =>
                ApplicationDocument.create(
                  StatementDocumentType.ADDITIONAL_STATEMENT,
                  id.toString(),
                  v.name,
                  v.amount,
                  v.transactions,
                  v.negativeDays,
                  fileResult.find((file) => Buffer.from(file.originalname, 'latin1').toString('utf8') === v.name),
                ),
              ),
            ),
          ),
        ),
      Result.ok(userId) as Result<Id>,
    ]).map((params) => new CreateApplicationCommand(...params));
  }
}
