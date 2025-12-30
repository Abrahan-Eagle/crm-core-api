import { Observable } from 'rxjs';

export interface EmailRequest {
  from: string;
  to?: string;
  bcc?: string[];
  subject: string;
  message?: string;
  html?: string;
  attachments: string[];
}

export interface MailerService {
  send(email: EmailRequest): Observable<void>;
}
