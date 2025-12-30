import { Expose, Type } from 'class-transformer';

import { CompanyResponse } from '@/app/company';
import { UserResponse } from '@/app/user';
import { ExposeId } from '@/infra/common';

import { ApplicationDocumentResponse } from './application-document.response';
import { FilledApplicationDocumentResponse } from './filled-application-document.request';

export class ApplicationResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  status: string;

  @Expose()
  substatus: string | null;

  @Expose()
  loan_amount: number;

  @Expose()
  product: string;

  @Expose()
  @Type(() => CompanyResponse)
  company: Partial<CompanyResponse>;

  @Expose()
  @Type(() => FilledApplicationDocumentResponse)
  filled_applications: FilledApplicationDocumentResponse[];

  @Expose()
  @Type(() => ApplicationDocumentResponse)
  bank_statements: ApplicationDocumentResponse[];

  @Expose()
  @Type(() => ApplicationDocumentResponse)
  credit_card_statements: ApplicationDocumentResponse[];

  @Expose()
  @Type(() => ApplicationDocumentResponse)
  mtd_statements: ApplicationDocumentResponse[];

  @Expose()
  @Type(() => ApplicationDocumentResponse)
  additional_statements: ApplicationDocumentResponse[];

  @Expose()
  reject_reason: string;

  @Expose()
  reject_reason_description: string;

  @Expose()
  created_at: string;

  @Expose()
  position: number | null;

  @Expose()
  @Type(() => UserResponse)
  created_by?: UserResponse;
}
