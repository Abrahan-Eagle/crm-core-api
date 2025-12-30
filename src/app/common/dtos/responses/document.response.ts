import { Expose } from 'class-transformer';

import { ExposeId } from '@/infra/common';

export class DocumentResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  url: string;

  @Expose()
  type?: string;
}
