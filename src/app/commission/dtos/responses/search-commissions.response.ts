import { Expose, Type } from 'class-transformer';

import { SearchBankResponse } from '@/app/bank';
import { SearchCompanyResponse } from '@/app/company';
import { ExposeId, TransformDate } from '@/infra/common';

export class SearchCommissionsResponse {
  @ExposeId()
  id: string;

  @Expose()
  @Type(() => SearchBankResponse)
  bank: Partial<SearchBankResponse>;

  @Expose()
  @Type(() => SearchCompanyResponse)
  company: Partial<SearchCompanyResponse>;

  @Expose()
  commission: number;

  @Expose()
  psf: number;

  @Expose()
  @TransformDate('YYYY-MM-DD')
  created_at: string;

  @Expose()
  status: string;
}
