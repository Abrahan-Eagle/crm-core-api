import { Expose } from 'class-transformer';

export class RejectBankNotificationViaWebhookRequest {
  @Expose()
  reason: string;

  @Expose()
  subject: string;

  @Expose()
  sender: string;

  @Expose()
  other?: string;
}
