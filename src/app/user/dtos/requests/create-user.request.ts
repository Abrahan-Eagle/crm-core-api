import { Expose } from 'class-transformer';

export class CreateUserRequest {
  @Expose()
  id: string;

  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose()
  password: string;

  @Expose()
  email: string;

  @Expose()
  roles: string[];

  @Expose()
  tenants: string[];
}
