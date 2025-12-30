import { Expose } from 'class-transformer';

import { ExposeId } from '@/infra/common';

export class ApplicationCompanyResponse {
  @ExposeId()
  id: string;

  @Expose()
  name: string;

  @Expose()
  dba?: string;

  @Expose()
  country_iso_code_2: string;
}
