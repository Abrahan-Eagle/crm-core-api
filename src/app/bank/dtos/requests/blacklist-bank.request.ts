import { Expose } from 'class-transformer';

export class BlacklistBankRequest {
  @Expose()
  note: string;
}
