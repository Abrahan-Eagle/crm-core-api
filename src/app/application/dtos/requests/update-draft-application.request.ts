import { Expose } from 'class-transformer';

export class UpdateDraftApplicationRequest {
  @Expose()
  amount: number;

  @Expose()
  transactions: number;

  @Expose()
  negative_days: number;

  @Expose()
  period: string;
}
