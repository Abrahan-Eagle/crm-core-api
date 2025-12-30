import { Expose } from 'class-transformer';

export class UpdateUserRequest {
  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose()
  tenants: string[];
}
