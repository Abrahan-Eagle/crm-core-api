import { Expose, Type } from 'class-transformer';

import { CompanyResponse } from '@/app/company';
import { UserResponse } from '@/app/user';
import { ExposeId } from '@/infra/common';

import { DraftApplicationDocumentResponse } from './draft-application-document.response';

export class DraftResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  loan_amount: number;

  @Expose()
  product: string;

  @Expose()
  @Type(() => CompanyResponse)
  company: Partial<CompanyResponse>;

  @Expose()
  @Type(() => DraftApplicationDocumentResponse)
  bank_statements: DraftApplicationDocumentResponse[];

  @Expose()
  signature_url: string | null;

  @Expose()
  created_at: string;

  @Expose()
  @Type(() => UserResponse)
  created_by?: UserResponse;
}
