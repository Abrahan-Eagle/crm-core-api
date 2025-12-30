import { Expose, Transform, Type } from 'class-transformer';

import { NoteResponse, PhoneResponse } from '@/app/common';
import { ExposeId } from '@/infra/common';

import { CallLogResponse } from './call-log.response';

export class ProspectResponse {
  @ExposeId()
  id: string;

  @Expose()
  company: string | null;

  @Expose()
  name: string;

  @Expose()
  @Type(() => CallLogResponse)
  call_history: CallLogResponse[];

  @Expose()
  @Type(() => NoteResponse)
  notes: NoteResponse[];

  @Expose()
  @Transform(({ value }) => value && value?.toISOString()?.split('T')[0])
  follow_up_call: string;

  @Expose()
  @Type(() => PhoneResponse)
  phone: PhoneResponse[];

  @Expose()
  email: string;
}
