import { Expose, Type } from 'class-transformer';

import { ContactResponse } from '@/app/contact';
import { TransformDate } from '@/infra/common';

export class CompanyMemberResponse {
  @Expose()
  @Type(() => ContactResponse)
  contact: Partial<ContactResponse>;

  @Expose()
  title: string;

  @Expose()
  percentage: number;

  @Expose()
  @TransformDate('YYYY-MM-DD')
  member_since: Date;
}
