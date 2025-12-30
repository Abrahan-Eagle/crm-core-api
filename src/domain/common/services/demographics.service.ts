import { Observable } from 'rxjs';

export interface Country extends Record<string, string> {}

export interface DemographicsService {
  allCountries(): Country;
  getStates(country: string): Observable<Record<string, string>>;
  getCitiesOfState(country: string, state: string): Observable<string[]>;
}
