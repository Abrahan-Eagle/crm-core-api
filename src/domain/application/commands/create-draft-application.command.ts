import { Nullable, OptionalValue, Result, Validator } from '@internal/common';
import { extname } from 'path';

import { BufferFile, DomainErrorCode, Id } from '@/domain/common';
import { normalizeFileName } from '@/domain/common/utils';
import { User } from '@/domain/user';

import { Application, DraftApplication, DraftApplicationDocument } from '../entities';
import { ApplicationReferral } from '../entities/application-referral.entity';

type ApplicationReferralRequest = {
  source: string;
  reference: Nullable<string>;
};

type ApplicationDocumentRequest = {
  name: string;
  period?: Nullable<string>;
};

export class CreateDraftApplicationCommand {
  private constructor(
    public readonly application: DraftApplication,
    public readonly referralId: Nullable<string>,
    public readonly audience: string,
    public readonly signature: BufferFile,
  ) {}

  static create(
    applicationId: OptionalValue<string>,
    companyId: OptionalValue<string>,
    loanAmount: number,
    prospectId: number,
    product: string,
    referral: OptionalValue<ApplicationReferralRequest>,
    bankStatements: OptionalValue<ApplicationDocumentRequest[]>,
    files: OptionalValue<Express.Multer.File[]>,
    userId: Nullable<Id>,
    audience: OptionalValue<string>,
    signature: OptionalValue<Express.Multer.File>,
    referralId: OptionalValue<string>,
  ): Result<CreateDraftApplicationCommand> {
    const fileResult = Validator.of(files)
      .array(() => DomainErrorCode.BANK_STATEMENTS_INVALID)
      .mapIfAbsent(() => [] as Express.Multer.File[])
      .getOrThrow();

    return Result.combine([
      Id.create(
        applicationId,
        () => DomainErrorCode.APPLICATION_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_ID_INVALID,
      ),
      Id.create(
        companyId,
        () => DomainErrorCode.APPLICATION_COMPANY_ID_EMPTY,
        () => DomainErrorCode.APPLICATION_COMPANY_ID_INVALID,
      ),
      Application.validateLoanAmount(loanAmount),
      DraftApplication.validateProspectId(prospectId),
      Application.validateProduct(product),
      referral !== undefined
        ? Application.validateReferral(referral).flatMap((referral) =>
            ApplicationReferral.create(referral?.source, referral?.reference),
          )
        : Result.ok(null),
      Application.validateBankStatements(bankStatements).flatMap((v) =>
        Result.combine(
          v.map((v) =>
            DraftApplicationDocument.create(
              Id.load(applicationId ?? ''),
              v.name,
              v.period,
              fileResult.find((file) => Buffer.from(file.originalname, 'latin1').toString('utf8') === v.name)!,
            ),
          ),
        ),
      ),
      Result.ok(userId),
    ])
      .flatMap((params) =>
        Result.combine([
          DraftApplication.create(...params),
          Validator.of(audience)
            .required(() => DomainErrorCode.AUDIENCE_ID_EMPTY)
            .string(() => DomainErrorCode.AUDIENCE_ID_INVALID) as Result<string>,
          Validator.of(signature)
            .required(() => DomainErrorCode.SIGNATURE_EMPTY)
            .map(
              (file) =>
                new BufferFile(
                  `${applicationId}/${normalizeFileName(Buffer.from(file.originalname, 'latin1').toString('utf8'))}`,
                  file.buffer,
                  extname(file.originalname),
                  file.mimetype,
                ),
            ) as Result<BufferFile>,
          referralId !== undefined && referralId !== null ? User.validateReferralId(referralId) : Result.ok(null),
        ]),
      )
      .map(
        ([application, audience, signature, referralId]) =>
          new CreateDraftApplicationCommand(application, referralId, audience, signature),
      );
  }
}
