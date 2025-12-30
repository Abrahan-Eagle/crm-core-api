import { Expose } from 'class-transformer';

export class OfferDetailsResponse {
  @Expose()
  amount_financed: number;

  @Expose()
  factor_rate: number;

  @Expose()
  points: number;

  @Expose()
  term: string;
}
