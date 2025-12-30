import { Expose, Type } from 'class-transformer';

import { UserResponse } from '@/app/user';
import { ExposeId } from '@/infra/common';

import { ApplicationCompanyResponse } from './application-company.response';

export class SearchDraftApplicationsResponse {
  @ExposeId()
  id: string;

  @Expose()
  period: string;

  @Expose()
  loan_amount: number;

  @Expose()
  product: string;

  @Expose()
  @Type(() => ApplicationCompanyResponse)
  company: ApplicationCompanyResponse;

  @Expose()
  created_at: string;

  @Expose()
  @Type(() => UserResponse)
  created_by?: UserResponse;
}
