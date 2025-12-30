import { Expose, Type } from 'class-transformer';

import { SearchBankResponse } from '@/app/bank';
import { SearchCompanyResponse } from '@/app/company';
import { ExposeId } from '@/infra/common';

import { CommissionDetailsResponse } from './commission-details.response';
import { OfferDetailsResponse } from './offer-details.response';

export class CommissionResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  @Type(() => OfferDetailsResponse)
  application: OfferDetailsResponse;

  @Expose()
  @Type(() => SearchCompanyResponse)
  company: Partial<SearchCompanyResponse>;

  @Expose()
  @Type(() => SearchBankResponse)
  bank: Partial<SearchBankResponse>;

  @Expose()
  @Type(() => CommissionDetailsResponse)
  commission: CommissionDetailsResponse;

  @Expose()
  @Type(() => CommissionDetailsResponse)
  psf: CommissionDetailsResponse;
}
