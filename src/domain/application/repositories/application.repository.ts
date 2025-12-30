import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { Application } from '../entities';

export interface ApplicationRepository {
  saveForTenants(apps: { application: Application; tenant: string }[]): Observable<void>;
  findById(id: Id): Observable<Nullable<Application>>;
  findByTrackingId(trackingId: string): Observable<Nullable<Application>>;
  getActiveByPeriod(period: string, companyId: Id): Observable<Nullable<Application>>;
  getActiveApplications(period: string, companyId: Id): Observable<Application[]>;
  updateOne(application: Application): Observable<void>;
  updateMany(applications: Application[]): Observable<void>;
  deleteMany(ids: Id[]): Observable<void>;
  getLastApplication(companyId: Id): Observable<Nullable<Application>>;
  getAppsByCompanyId(period: string, companyId: Id): Observable<Application[]>;
}
