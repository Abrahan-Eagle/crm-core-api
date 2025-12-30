import { GetCompaniesByContactIdQueryHandler } from './get-companies-by-contact-id.query-handler';
import { GetCompanyByIdQueryHandler } from './get-company-by-id.query-handler';
import { GetCompanyByTaxIdQueryHandler } from './get-company-by-tax-id.query-handler';
import { SearchCompaniesQueryHandler } from './search-companies.query-handler';

export * from './search-companies.query-handler';

export const CompanyQueryHandlers = [
  GetCompaniesByContactIdQueryHandler,
  GetCompanyByIdQueryHandler,
  GetCompanyByTaxIdQueryHandler,
  SearchCompaniesQueryHandler,
];
