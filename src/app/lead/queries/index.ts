import { GetProspectByIdQueryHandler } from './get-prospect-by-id.query-handler';
import { SearchLeadQueryHandler } from './search-leads.query-handler';
import { SearchProspectsQueryHandler } from './search-prospects.query-handler';

export const LeadQueryHandlers = [GetProspectByIdQueryHandler, SearchLeadQueryHandler, SearchProspectsQueryHandler];
