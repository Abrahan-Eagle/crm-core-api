import { Expose, Type } from 'class-transformer';

import { UserResponse } from '@/app/user';
import { ExposeId, TransformDate } from '@/infra/common';

export class NoteResponse {
  @ExposeId({ name: '_id' })
  id: string;

  @Expose()
  description: string;

  @Expose()
  level: string;

  @Expose()
  @TransformDate('YYYY-MM-DD')
  created_at: string;

  @Expose()
  @Type(() => UserResponse)
  author: UserResponse;
}
