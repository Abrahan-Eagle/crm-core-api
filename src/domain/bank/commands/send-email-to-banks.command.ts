import { OptionalValue, Result, Validator } from '@internal/common';

import { ENTITY_MEDIA_TYPE } from '@/app/common';
import { DomainErrorCode, Id } from '@/domain/common';

export type AttachmentInputData = {
  entityType: OptionalValue<string>;
  entityId: OptionalValue<string>;
  documentId: OptionalValue<string>;
};

export type AttachmentData = {
  entityType: ENTITY_MEDIA_TYPE;
  entityId: Id;
  documentId: Id;
};

export class SendEmailToBanksCommand {
  private constructor(
    public readonly bankIds: Id[],
    public readonly subject: string,
    public readonly message: string,
    public readonly attachments: AttachmentData[],
  ) {}

  static create(
    banksIds: OptionalValue<string[]>,
    subject: OptionalValue<string>,
    message: OptionalValue<string>,
    attachments: OptionalValue<AttachmentInputData[]>,
  ): Result<SendEmailToBanksCommand> {
    return Result.combine([
      Validator.of(banksIds)
        .required(() => DomainErrorCode.BANK_IDS_EMPTY)
        .array(() => DomainErrorCode.BANK_IDS_INVALID)
        .minLength(1, () => DomainErrorCode.BANK_IDS_EMPTY)
        .maxLength(30, () => DomainErrorCode.BANK_IDS_TOO_MANY)
        .flatMap((ids) =>
          Result.combine(
            ids.map((id) =>
              Id.create(
                id,
                () => DomainErrorCode.BANK_ID_EMPTY,
                () => DomainErrorCode.BANK_ID_INVALID,
              ),
            ),
          ),
        ),
      Validator.of(subject)
        .required(() => DomainErrorCode.EMAIL_SUBJECT_EMPTY)
        .string(() => DomainErrorCode.EMAIL_SUBJECT_INVALID)
        .minLength(1, () => DomainErrorCode.EMAIL_SUBJECT_EMPTY)
        .maxLength(35, () => DomainErrorCode.EMAIL_SUBJECT_TOO_LONG),
      Validator.of(message)
        .required(() => DomainErrorCode.EMAIL_MESSAGE_EMPTY)
        .string(() => DomainErrorCode.EMAIL_MESSAGE_INVALID)
        .minLength(1, () => DomainErrorCode.EMAIL_MESSAGE_EMPTY)
        .maxLength(2000, () => DomainErrorCode.EMAIL_MESSAGE_TOO_LONG),
      Validator.of(attachments)
        .required(() => DomainErrorCode.EMAIL_ATTACHMENTS_EMPTY)
        .array(() => DomainErrorCode.EMAIL_ATTACHMENTS_INVALID)
        .minLength(1, () => DomainErrorCode.EMAIL_ATTACHMENTS_EMPTY)
        .maxLength(10, () => DomainErrorCode.EMAIL_ATTACHMENTS_TOO_MANY)
        .flatMap((attachments) =>
          Result.combine(
            attachments.map((attachment) =>
              Result.combine([
                Validator.of(attachment.entityType)
                  .required(() => DomainErrorCode.ATTACHMENT_ENTITY_TYPE_EMPTY)
                  .string(() => DomainErrorCode.ATTACHMENT_ENTITY_TYPE_INVALID)
                  .enum(ENTITY_MEDIA_TYPE, () => DomainErrorCode.ATTACHMENT_ENTITY_TYPE_INVALID)
                  .map((entityType) => entityType as ENTITY_MEDIA_TYPE),
                Id.create(
                  attachment.entityId,
                  () => DomainErrorCode.ATTACHMENT_ENTITY_ID_EMPTY,
                  () => DomainErrorCode.ATTACHMENT_ENTITY_ID_INVALID,
                ),
                Id.create(
                  attachment.documentId,
                  () => DomainErrorCode.ATTACHMENT_DOCUMENT_ID_EMPTY,
                  () => DomainErrorCode.ATTACHMENT_DOCUMENT_ID_INVALID,
                ),
              ]).map(([entityType, entityId, documentId]) => ({
                entityType,
                entityId,
                documentId,
              })),
            ),
          ),
        ),
    ]).map(
      ([bankIds, subject, message, attachments]) =>
        new SendEmailToBanksCommand(bankIds, subject as string, message as string, attachments as AttachmentData[]),
    );
  }
}
