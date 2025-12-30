import { Expose } from 'class-transformer';

export class ApplicationDocumentRequest {
  @Expose()
  name: string;

  @Expose()
  amount: number;

  @Expose()
  transactions: number;

  @Expose({ name: 'negative_days' })
  negativeDays: number;

  @Expose()
  period?: string;
}
