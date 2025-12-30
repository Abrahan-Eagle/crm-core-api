import { Expose, Type } from 'class-transformer';

import { ConstraintsResponse } from '@/app/bank';
import { AddressResponse } from '@/app/common';
import { ExposeId } from '@/infra/common';

export class RecommendedBankResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose({ name: 'bank_name' })
  name: string;

  @Expose()
  bank_type: string;

  @Expose()
  manager: string;

  @Expose()
  @Type(() => AddressResponse)
  address: AddressResponse;

  @Expose()
  @Type(() => ConstraintsResponse)
  constraints: ConstraintsResponse;
}
