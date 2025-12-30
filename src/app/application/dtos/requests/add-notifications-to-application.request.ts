import { Expose } from 'class-transformer';

export class AddNotificationsToApplicationRequest {
  @Expose()
  message: string;

  @Expose({ name: 'bank_ids' })
  bankIds: string[];
}
