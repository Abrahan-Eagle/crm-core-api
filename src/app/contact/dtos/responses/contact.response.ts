import { Expose, Transform, Type } from 'class-transformer';

import { AddressResponse, DocumentResponse, NoteResponse, PhoneResponse } from '@/app/common';
import { UserResponse } from '@/app/user';
import { ExposeId, HideEmailTransformer, HideSSNTransformer, TransformDate } from '@/infra/common';

export class ContactResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  @TransformDate('YYYY-MM-DD')
  birthdate: string;

  @Expose()
  @Transform(HideSSNTransformer())
  ssn: string;

  @Expose()
  identification_type: string;

  @Expose()
  @Type(() => AddressResponse)
  address: AddressResponse;

  @Expose()
  @Type(() => PhoneResponse)
  phones: PhoneResponse[];

  @Expose()
  @Transform(HideEmailTransformer())
  emails: string[];

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
