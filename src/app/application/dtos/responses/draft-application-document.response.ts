import { Expose } from 'class-transformer';

export class DraftApplicationDocumentResponse {
  @Expose()
  url: string;

  @Expose()
  period: string;

  @Expose()
  amount?: number;

  @Expose()
  transactions?: number;

  @Expose()
  negative_days?: number;
}
