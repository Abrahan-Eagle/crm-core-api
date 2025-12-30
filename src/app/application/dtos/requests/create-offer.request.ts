import { Expose } from 'class-transformer';

export class CreateOfferRequest {
  @Expose()
  id: string;

  @Expose({ name: 'purchased_amount' })
  purchasedAmount: number;

  @Expose({ name: 'factor_rate' })
  factorRate: number;

  @Expose()
  points: number;

  @Expose()
  position?: number;

  @Expose({ name: 'payment_plan' })
  paymentPlan?: string;

  @Expose({ name: 'payment_plan_duration' })
  paymentPlanDuration?: number;
}
