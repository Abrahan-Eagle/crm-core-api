import * as countries from '@assets/demographics/all-countries.json';
import * as PRStates from '@assets/demographics/states-of-puerto-rico.json';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable, of, tap } from 'rxjs';

import { Country, DemographicsService } from '@/domain/common';

@Injectable()
export class HttpDemographicsService implements DemographicsService {
  DEMOGRAPHIC_BASE_API = 'https://countriesnow.space/api/v0.1';

  private countryStatesCache = new Map<string, Record<string, string>>();

  private citiesCache = new Map<string, string[]>();

  constructor(private readonly _http: HttpService) {}

  public allCountries(): Country {
    return countries;
  }

  public getStates(country: string): Observable<Record<string, string>> {
    if (this.countryStatesCache.has(country)) {
      return of(this.countryStatesCache.get(country)!);
    }

    if (country === 'Puerto Rico') {
      return of(PRStates);
    }

    return this._http
      .post<{ data: { states: { name: string; state_code: string }[] } }>(
        `${this.DEMOGRAPHIC_BASE_API}/countries/states`,
        {
          country,
        },
      )
      .pipe(
        map((response) => response.data),
        map((response) => {
          const states: Record<string, string> = {};
          response.data.states.forEach((state) => (states[state.state_code] = state.name));
          return states;
        }),
        tap((states) => this.countryStatesCache.set(country, states)),
      );
  }

  public getCitiesOfState(country: string, state: string): Observable<string[]> {
    if (this.citiesCache.has(`${country}_${state}`)) {
      return of(this.citiesCache.get(`${country}_${state}`)!);
    }

    if (country === 'Puerto Rico') {
      return of([]);
    }

    return this._http
      .post<{ data: string[] }>(`${this.DEMOGRAPHIC_BASE_API}/countries/state/cities`, {
        body: { country, state },
      })
      .pipe(
        map((response) => response.data),
        map((response) => response.data),
        tap((cities) => this.citiesCache.set(`${country}_${state}`, cities)),
      );
  }
}
