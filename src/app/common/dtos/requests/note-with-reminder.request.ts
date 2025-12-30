import { Expose } from 'class-transformer';

import { NoteRequest } from './note.request';

export class NoteWithReminderRequest extends NoteRequest {
  @Expose()
  follow_up_call?: string;
}
