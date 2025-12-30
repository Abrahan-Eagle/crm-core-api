import { mapToVoid, Nullable, Phone } from '@internal/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs';

import { VoIPProviderConfig } from '@/app/common';
import { CallFailed } from '@/domain/common';
import { VoIPProviderRepository } from '@/domain/user';

export interface AgentList {
  responseData: { data: { Agent: { email: string; id: string } }[] };
}

@Injectable()
export class CloudTalkVoIPProviderRepository implements VoIPProviderRepository {
  constructor(
    private readonly http: HttpService,
    private readonly config: VoIPProviderConfig,
  ) {}

  makeACall(phone: Phone, agentId: string): Observable<void> {
    return of(phone).pipe(
      map((phone) => {
        const parsed = PhoneNumberUtil.getInstance().parse(`${phone.intlPrefix}${phone.number}`);
        return PhoneNumberUtil.getInstance().format(parsed, PhoneNumberFormat.E164);
      }),
      mergeMap((parsedPhone) =>
        this.http.post(
          `${this.config.baseUrl}/api/calls/create.json`,
          {
            agent_id: agentId,
            callee_number: parsedPhone,
          },
          {
            auth: {
              username: this.config.clientId,
              password: this.config.clientSecret,
            },
          },
        ),
      ),
      mapToVoid(),
      catchError((error) => {
        if (error instanceof AxiosError && error?.response?.data?.responseData?.message) {
          return throwError(() => new CallFailed(error?.response?.data?.responseData?.message));
        }

        return throwError(() => error);
      }),
    );
  }

  getAgentIdFromEmail(email: string): Observable<Nullable<string>> {
    return this.http
      .get<AgentList>(`${this.config.baseUrl}/api/agents/index.json?limit=1000`, {
        auth: {
          username: this.config.clientId,
          password: this.config.clientSecret,
        },
      })
      .pipe(
        map((response) => response.data?.responseData?.data?.find((item) => item.Agent.email === email)),
        map((item) => item?.Agent?.id ?? null),
      );
  }
}
