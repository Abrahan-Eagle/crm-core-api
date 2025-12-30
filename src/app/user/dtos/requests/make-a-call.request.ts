import { Expose } from 'class-transformer';

export class MakeACallRequest {
  @Expose({ name: 'entity_type' })
  entityType: string;

  @Expose({ name: 'entity_id' })
  entityId: string;

  @Expose({ name: 'phone_index' })
  phoneIndex: number;
}
