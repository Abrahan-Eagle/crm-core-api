import { mapToVoid, NotFound } from '@internal/common';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, map, Observable, throwError } from 'rxjs';

import { SchedulerServiceConfig } from '@/app/common';
import { SchedulerService, WebhookJob } from '@/domain/common';

@Injectable()
export class HttpSchedulerService implements SchedulerService {
  private readonly logger = new Logger(HttpSchedulerService.name);

  constructor(
    private readonly http: HttpService,
    private readonly scheduler: SchedulerServiceConfig,
  ) {}

  deleteJob(jobId: string): Observable<void> {
    return this.http
      .delete<void>(
        `${this.scheduler.config.baseUrl}/v1/jobs/webhook/${jobId}?auth=${this.scheduler.config.webhookAuthKey}`,
      )
      .pipe(
        mapToVoid(),
        catchError((error) => this.handleError(error)),
      );
  }

  schedule(job: WebhookJob): Observable<string> {
    const payload = {
      name: job.name,
      priority: job.priority,
      data: job.data,
      webhook: {
        url: job.url,
        method: job.method,
        timeout: 60000,
      },
      ...(job.repeat ? { repeat: job.repeat } : {}),
    };

    this.logger.debug(`Scheduling job '${job.name}...`);
    return this.http
      .post<{ job_id: string }>(
        `${this.scheduler.config.baseUrl}/v1/jobs/webhook?auth=${this.scheduler.config.webhookAuthKey}`,
        payload,
      )
      .pipe(
        map((response) => response.data.job_id),
        catchError((error) => this.handleError(error)),
      );
  }

  private handleError(error: AxiosError, jobId?: string): Observable<any> {
    const data = error?.response?.data as any;

    if (data?.code === 'NOT_FOUND') return throwError(() => NotFound.of('Scheduled job', String(jobId)));

    if (data) error.message = `${error.message}\n${JSON.stringify(data, null, 2)}`;

    this.logger.error(error.message);
    return throwError(() => error);
  }
}
