import { Email, mapToVoid, Nullable } from '@internal/common';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ExternalContactsConfig } from '@/app/common';
import { ExternalContactsRepository, Prospect } from '@/domain/contact';

@Injectable()
export class SystemeExternalContactsRepository implements ExternalContactsRepository {
  private readonly logger = new Logger(SystemeExternalContactsRepository.name);

  private readonly defaultHeaders = {
    accept: 'application/json',
    'content-type': 'application/json',
  };

  constructor(
    private readonly config: ExternalContactsConfig,
    private http: HttpService,
  ) {}

  getProspectId(email: Email, audience: string): Observable<Nullable<number>> {
    return this.http
      .get<{ items: { id: number }[] }>(`${this.config.baseUrl}/contacts?email=${encodeURIComponent(email.value)}`, {
        headers: { ...this.defaultHeaders, 'X-API-Key': this.config.secret?.[audience].key },
      })
      .pipe(
        map((response) => response.data.items?.at(0)?.id ?? null),
        catchError((error) => this.handleError(error)),
      );
  }

  addTag(prospectId: number, tagId: number, audience: string): Observable<void> {
    return this.http
      .post(
        `${this.config.baseUrl}/contacts/${prospectId}/tags`,
        { tagId },
        { headers: { ...this.defaultHeaders, 'X-API-Key': this.config.secret?.[audience].key } },
      )
      .pipe(
        mapToVoid(),
        catchError((error) => this.handleError(error)),
      );
  }

  removeTag(prospectId: number, tagId: number, audience: string): Observable<void> {
    return this.http
      .delete(`${this.config.baseUrl}/contacts/${prospectId}/tags/${tagId}`, {
        headers: { ...this.defaultHeaders, 'X-API-Key': this.config.secret?.[audience].key },
      })
      .pipe(
        mapToVoid(),
        catchError((error) => this.handleError(error)),
      );
  }

  optInProspect(prospect: Prospect, audience: string): Observable<number> {
    const fields = [
      {
        slug: 'first_name',
        value: prospect.first_name,
      },
      {
        slug: 'surname',
        value: prospect.last_name,
      },
      {
        slug: 'phone_number',
        value: prospect.phone.toString(),
      },
      {
        slug: 'looking_for',
        value: (prospect.looking_for ?? '')?.toString(),
      },
      {
        slug: 'language',
        value: prospect.lang,
      },
    ];

    return this.http
      .post<{ id: number }>(
        `${this.config.baseUrl}/contacts`,
        {
          email: prospect.email.toString(),
          fields,
        },
        { headers: { ...this.defaultHeaders, 'X-API-Key': this.config.secret?.[audience].key } },
      )
      .pipe(
        map((response) => response.data.id),
        catchError((error) => this.handleError(error)),
      );
  }

  private handleError(error: AxiosError): Observable<any> {
    const data = error?.response?.data as any;

    if (data) error.message = `${error.message}\n${JSON.stringify(data, null, 2)}`;

    this.logger.error(error.message);
    return throwError(() => error);
  }
}
