import { GetDashboardQueryHandler } from './get-dashboard.query-handler';
import { GetIndustriesQueryHandler } from './get-industries.query-handler';
import { GetTenantConfigQueryHandler } from './get-tenant-config.query-handler';

export * from './get-industries.query-handler';

export const CommonQueryHandlers = [GetDashboardQueryHandler, GetIndustriesQueryHandler, GetTenantConfigQueryHandler];
