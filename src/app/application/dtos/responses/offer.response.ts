import { Expose } from 'class-transformer';

import { ExposeId } from '@/infra/common';

export class OfferResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  purchased_amount: number;

  @Expose()
  factor_rate: number;

  @Expose()
  points: number;

  @Expose()
  position: number;

  @Expose()
  payment_plan: string;

  @Expose()
  payment_plan_duration: string;

  @Expose()
  status: string;

  @Expose()
  created_at: string;

  @Expose()
  updated_at?: string;

  // Calculated fields - computed at runtime
  @Expose()
  purchased_price: number;

  @Expose()
  commission: number;
}
