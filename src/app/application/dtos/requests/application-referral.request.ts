import { Expose } from 'class-transformer';

export class ApplicationReferralRequest {
  @Expose()
  source: string;

  @Expose()
  reference: string;
}
