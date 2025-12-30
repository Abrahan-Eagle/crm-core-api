import { Expose, Type } from 'class-transformer';

import { ApplicationReferralRequest } from '@/app/application';
import { PhoneRequest } from '@/app/common';

export class OptInProspectRequest {
  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose()
  loan_amount: number;

  @Expose()
  @Type(() => PhoneRequest)
  phone: PhoneRequest;

  @Expose()
  email: string;

  @Expose()
  audience: string;

  @Expose()
  lang: string;

  @Expose()
  @Type(() => ApplicationReferralRequest)
  referral: ApplicationReferralRequest;
}
