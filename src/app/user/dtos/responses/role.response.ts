import { Expose } from 'class-transformer';

export class RoleResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
