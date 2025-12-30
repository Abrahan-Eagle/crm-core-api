import { Expose } from 'class-transformer';

export class SendPendingNotificationsRequest {
  @Expose()
  message: string;
}
