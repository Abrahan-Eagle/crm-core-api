import { Expose } from 'class-transformer';

export class ToggleUserRoleRequest {
  @Expose({ name: 'user_id' })
  userId: string;

  @Expose()
  role: string;
}
