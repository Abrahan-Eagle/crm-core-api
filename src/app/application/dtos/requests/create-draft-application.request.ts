import { Expose, Type } from 'class-transformer';

import { ApplicationDocumentRequest } from './application-document.request';
import { ApplicationReferralRequest } from './application-referral.request';

export class CreateDraftApplicationRequest {
  @Expose({ name: 'application_id' })
  applicationId: string;

  @Expose({ name: 'company_id' })
  companyId: string;

  @Expose({ name: 'loan_amount' })
  loanAmount: number;

  @Expose({ name: 'prospect_id' })
  prospectId: number;

  @Expose({ name: 'referral_id' })
  referralId: string;

  @Expose()
  product: string;

  @Expose()
  @Type(() => ApplicationReferralRequest)
  referral?: ApplicationReferralRequest;

  @Expose({ name: 'bank_statements' })
  @Type(() => ApplicationDocumentRequest)
  bankStatements: ApplicationDocumentRequest[];

  @Expose()
  audience: string;
}
