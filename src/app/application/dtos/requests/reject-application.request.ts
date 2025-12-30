import { OptionalValue } from '@internal/common';
import { Expose } from 'class-transformer';

export class RejectApplicationRequest {
  @Expose()
  reason: string;

  @Expose()
  other: OptionalValue<string>;
}
