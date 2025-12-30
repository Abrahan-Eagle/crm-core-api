import { Expose } from 'class-transformer';

export class BankBlacklistResponse {
  @Expose()
  blacklisted_at: Date;

  @Expose()
  blacklisted_by: string;

  @Expose()
  note: string;
}
