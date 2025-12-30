import { Expose } from 'class-transformer';

export class ApplicationDocumentResponse {
  @Expose()
  url: string;

  @Expose()
  amount: number;

  @Expose()
  transactions: number;

  @Expose()
  negative_days: number;

  @Expose()
  period?: string;
}
