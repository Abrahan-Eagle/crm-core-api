import { Expose } from 'class-transformer';

export class UpdateSubstatusRequest {
  @Expose()
  substatus: string;
}
