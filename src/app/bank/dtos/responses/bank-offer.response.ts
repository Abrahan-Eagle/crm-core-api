import { Expose, Type } from 'class-transformer';

import { OfferResponse } from '@/app/application';
import { CompanyResponse } from '@/app/company';
import { ExposeId } from '@/infra/common';

export class BankOfferResponse {
  @ExposeId()
  id: string;

  @Expose()
  @Type(() => CompanyResponse)
  company: Partial<CompanyResponse>;

  @Expose()
  @Type(() => OfferResponse)
  offer: Partial<OfferResponse>;
}
