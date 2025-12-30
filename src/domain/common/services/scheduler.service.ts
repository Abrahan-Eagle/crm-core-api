import { Observable } from 'rxjs';

export interface WebhookJob {
  name: string;
  priority: 'low' | 'medium' | 'high';
  data?: Record<string, any>;
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELET';
  repeat?: {
    cron_pattern: string;
    limit?: number;
  };
}

export interface SchedulerService {
  schedule(job: WebhookJob): Observable<string>;
  deleteJob(jobId: string): Observable<void>;
}
