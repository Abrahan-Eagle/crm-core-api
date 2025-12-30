import { Expose, Type } from 'class-transformer';

import { ApplicationDocumentRequest } from './application-document.request';
import { ApplicationReferralRequest } from './application-referral.request';

export class CreateApplicationRequest {
  @Expose({ name: 'company_id' })
  companyId: string;

  @Expose({ name: 'loan_amount' })
  loanAmount: number;

  @Expose()
  product: string;

  @Expose()
  @Type(() => ApplicationReferralRequest)
  referral: ApplicationReferralRequest;

  @Expose({ name: 'bank_statements' })
  @Type(() => ApplicationDocumentRequest)
  bankStatements: ApplicationDocumentRequest[];

  @Expose({ name: 'mtd_statements' })
  @Type(() => ApplicationDocumentRequest)
  mtdStatements: ApplicationDocumentRequest[];

  @Expose({ name: 'credit_card_statements' })
  @Type(() => ApplicationDocumentRequest)
  creditCardStatements: ApplicationDocumentRequest[];

  @Expose({ name: 'additional_statements' })
  @Type(() => ApplicationDocumentRequest)
  additionalStatements: ApplicationDocumentRequest[];
}
