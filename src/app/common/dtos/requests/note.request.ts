import { Expose } from 'class-transformer';

export class NoteRequest {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  level: string;
}
