import { Expose, Transform, Type } from 'class-transformer';

import { ExposeId, HideValueTransformer } from '@/infra/common';

import { OfferResponse } from './offer.response';

class BankDetailResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  @Transform(HideValueTransformer({ hideOptionName: 'hideBankName' }))
  name: string;

  @Expose()
  bank_type: string;
}

export class BankNotificationResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => OfferResponse)
  offers: OfferResponse[];

  @Expose()
  @Type(() => BankDetailResponse)
  bank: BankDetailResponse;

  @Expose()
  reject_reason: string;

  @Expose()
  reject_reason_description: string;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string;
}
