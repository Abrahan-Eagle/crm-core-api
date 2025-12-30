import { Expose } from 'class-transformer';

export class CreateLeadRequest {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose({ name: 'assigned_to' })
  assignedTo: string;
}
