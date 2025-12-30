import { AggregateRoot, Nullable, OptionalValue, Result, Undefinable, Validator } from '@internal/common';

import { BufferFile, DomainErrorCode, Id, PRODUCT_TYPE } from '@/domain/common';
import { getPeriodFromDate } from '@/domain/common/utils';

import { Application } from '../application.entity';
import { ApplicationReferral } from '../application-referral.entity';
import { DraftApplicationDocument } from './draft-application-document.entity';

export class DraftApplication extends AggregateRoot {
  constructor(
    public readonly id: Id,
    public readonly companyId: Id,
    public readonly period: string,
    public readonly loanAmount: number,
    public readonly prospectId: number,
    public readonly product: PRODUCT_TYPE,
    public readonly referral: Nullable<ApplicationReferral>,
    public readonly bankStatements: DraftApplicationDocument[],
    private _signatureUrl: Nullable<string>,
    private _createdBy: Nullable<Id>,
    public readonly createdAt: Date,
    private _updatedAt: Undefinable<Date>,
    public readonly version?: number,
  ) {
    super();
  }

  get createdBy(): Nullable<Id> {
    return this._createdBy;
  }

  get signatureUrl(): Nullable<string> {
    return this._signatureUrl;
  }

  get updatedAt(): Undefinable<Date> {
    return this._updatedAt;
  }

  get isValid(): boolean {
    return this.bankStatements.every((file) => file.isValid());
  }

  get allFiles(): BufferFile[] {
    return this.bankStatements.map((doc) => doc.file).filter(Boolean) as BufferFile[];
  }

  static create(
    id: Id,
    companyId: Id,
    loanAmount: OptionalValue<number>,
    prospectId: OptionalValue<number>,
    product: OptionalValue<string>,
    referral: OptionalValue<ApplicationReferral>,
    bankStatements: DraftApplicationDocument[],
    createdBy: Nullable<Id>,
  ): Result<DraftApplication> {
    const now = new Date();
    const period = getPeriodFromDate(new Date());

    return Result.combine([
      Application.validateLoanAmount(loanAmount),
      this.validateProspectId(prospectId),
      Application.validateProduct(product),
      Application.validateReferral(referral),
      Application.validateBankStatements<DraftApplicationDocument>(bankStatements).flatMap<DraftApplicationDocument[]>(
        (documents) =>
          Validator.of(documents).unique(
            (doc) => doc.name,
            () => DomainErrorCode.DUPLICATE_FILE_NAMES_PRESENT,
          ),
      ),
    ]).map(
      ([loanAmount, prospectId, product, referral, statements]) =>
        new DraftApplication(
          id,
          companyId,
          period,
          loanAmount,
          prospectId,
          product,
          referral,
          statements,
          null,
          createdBy,
          now,
          now,
        ),
    );
  }

  static validateProspectId(prospectId: OptionalValue<number>): Result<number> {
    return Validator.of(prospectId)
      .required(() => DomainErrorCode.PROSPECT_ID_EMPTY)
      .number(() => DomainErrorCode.PROSPECT_ID_INVALID)
      .min(0, () => DomainErrorCode.PROSPECT_ID_INVALID)
      .max(99999999999, () => DomainErrorCode.PROSPECT_ID_INVALID);
  }

  public transfer(userId: Id): Result<void> {
    return Result.ok().onSuccess(() => {
      this._createdBy = userId;
      this._updatedAt = new Date();
    });
  }

  public addSignature(file: BufferFile): Result<void> {
    return Validator.of(file.extension)
      .required(() => DomainErrorCode.FILE_TYPE_EMPTY)
      .string(() => DomainErrorCode.FILE_TYPE_INVALID)
      .validate(
        (ext) => ['png'].includes(ext.replaceAll('.', '')),
        () => DomainErrorCode.FILE_TYPE_INVALID,
      )
      .flatMap(() => Result.ok())
      .onSuccess(() => {
        this._signatureUrl = file.name;
      });
  }
}
