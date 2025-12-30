import { Expose } from 'class-transformer';

export class UpdateOfferRequest {
  @Expose({ name: 'purchased_amount' })
  purchasedAmount?: number;

  @Expose({ name: 'factor_rate' })
  factorRate?: number;

  @Expose()
  position?: number;

  @Expose()
  points?: number;

  @Expose({ name: 'payment_plan' })
  paymentPlan?: string;

  @Expose({ name: 'payment_plan_duration' })
  paymentPlanDuration?: number;
}
