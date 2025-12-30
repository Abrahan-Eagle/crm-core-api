import { Expose, Type } from 'class-transformer';

import { AddressRequest, NoteRequest, PhoneRequest } from '@/app/common';

export class CreateContactRequest {
  @Expose()
  id: string;

  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose()
  birthdate: string;

  @Expose()
  ssn: string;

  @Expose()
  @Type(() => AddressRequest)
  address: AddressRequest;

  @Expose()
  @Type(() => PhoneRequest)
  phones: PhoneRequest[];

  @Expose()
  emails: string[];

  @Expose()
  @Type(() => NoteRequest)
  note?: NoteRequest;
}
