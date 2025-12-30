import { Expose, Type } from 'class-transformer';

export class AttachmentRequest {
  @Expose({ name: 'entity_type' })
  entityType: string;

  @Expose({ name: 'entity_id' })
  entityId: string;

  @Expose({ name: 'document_id' })
  documentId: string;
}

export class SendEmailToBanksRequest {
  @Expose({ name: 'bank_ids' })
  bankIds: string[];

  @Expose()
  subject: string;

  @Expose()
  message: string;

  @Expose()
  @Type(() => AttachmentRequest)
  attachments: AttachmentRequest[];
}
