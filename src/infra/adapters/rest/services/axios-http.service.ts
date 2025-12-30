import { HEADER_REQUEST_ID, RequestContextStorage } from '@internal/http';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class AxiosHttpService {
  constructor(
    protected readonly http: HttpService,
    private readonly requestContext: RequestContextStorage,
  ) {}

  get<T>(url: string, config: AxiosRequestConfig = {}): Observable<AxiosResponse<T>> {
    return this.http.get<T>(url, {
      ...config,
      headers: {
        Accept: 'application/json',
        [HEADER_REQUEST_ID]: this.requestContext.getStore()?.requestId,
        ...(config?.headers ?? {}),
      },
    });
  }
}
