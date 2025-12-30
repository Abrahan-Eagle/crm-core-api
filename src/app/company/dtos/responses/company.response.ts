import { Expose, Transform, Type } from 'class-transformer';

import { AddressResponse, DocumentResponse, IndustryResponse, NoteResponse, PhoneResponse } from '@/app/common';
import { UserResponse } from '@/app/user';
import { ExposeId, HideEmailTransformer, HideTaxIdTransformer, TransformDate } from '@/infra/common';

import { CompanyMemberResponse } from './company-member.response';

export class CompanyResponse {
  @ExposeId()
  id: string;

  @Expose()
  name: string;

  @Expose()
  dba?: string;

  @Expose()
  @Transform(HideTaxIdTransformer())
  tax_id: string;

  @Expose()
  @Type(() => IndustryResponse)
  industry: IndustryResponse;

  @Expose()
  service: string;

  @Expose()
  @TransformDate('YYYY-MM-DD')
  creation_date: string;

  @Expose()
  entity_type: string;

  @Expose()
  @Type(() => PhoneResponse)
  phone_numbers: PhoneResponse[];

  @Expose()
  @Transform(HideEmailTransformer())
  emails: string[];

  @Expose()
  @Type(() => AddressResponse)
  address: AddressResponse;

  @Expose()
  @Type(() => CompanyMemberResponse)
  members: CompanyMemberResponse[];

  @Expose()
  @Type(() => DocumentResponse)
  documents: DocumentResponse[];

  @Expose()
  @Type(() => UserResponse)
  created_by?: UserResponse;

  @Expose()
  created_at: Date;

  @Expose()
  @Type(() => NoteResponse)
  notes: NoteResponse[];
}
