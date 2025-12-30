import { OptionalValue } from '@internal/common';
import { Expose } from 'class-transformer';

export class RejectBankNotificationRequest {
  @Expose()
  reason: string;

  @Expose()
  other: OptionalValue<string>;
}
