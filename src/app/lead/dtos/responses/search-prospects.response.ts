import { Expose, Transform } from 'class-transformer';

import { ExposeId } from '@/infra/common';

export class SearchProspectsResponse {
  @ExposeId()
  id: string;

  @Expose()
  company: string | null;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => value && value?.toISOString()?.split('T')[0])
  follow_up_call: string;

  @Expose()
  last_call: Date | null;

  @Expose()
  note_count: number;
}
