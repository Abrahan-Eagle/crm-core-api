import { Expose, Type } from 'class-transformer';

import { AddressResponse, DocumentResponse } from '@/app/common';
import { ExposeId } from '@/infra/common';

import { BankBlacklistResponse } from './bank-blacklist.response';
import { BankContactResponse } from './bank-contact.response';
import { ConstraintsResponse } from './constraints.response';

export class BankResponse {
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
  @Type(() => BankContactResponse)
  contacts: BankContactResponse[];

  @Expose()
  @Type(() => ConstraintsResponse)
  constraints: ConstraintsResponse;

  @Expose()
  @Type(() => DocumentResponse)
  documents: DocumentResponse[];

  @Expose()
  status: string;

  @Expose()
  @Type(() => BankBlacklistResponse)
  blacklist: BankBlacklistResponse | null;
}
