import { Expose, Type } from 'class-transformer';

import { AddressRequest, PhoneRequest } from '@/app/common';

export class UpdateCompanyMemberRequest {
  @Expose({ name: 'contact_id' })
  contactId: string;

  @Expose()
  title: string;

  @Expose()
  percentage: number;

  @Expose({ name: 'member_since' })
  memberSince: string;
}

export class UpdateCompanyRequest {
  @Expose({ name: 'name' })
  companyName?: string;

  @Expose()
  dba?: string;

  @Expose()
  industry?: string;

  @Expose()
  service?: string;

  @Expose({ name: 'creation_date' })
  creationDate?: string;

  @Expose({ name: 'entity_type' })
  entityType?: string;

  @Expose({ name: 'phone_numbers' })
  @Type(() => PhoneRequest)
  phoneNumbers?: PhoneRequest[];

  @Expose()
  emails?: string[];

  @Expose()
  @Type(() => AddressRequest)
  address?: AddressRequest;

  @Expose()
  @Type(() => UpdateCompanyMemberRequest)
  members?: UpdateCompanyMemberRequest[];
}
