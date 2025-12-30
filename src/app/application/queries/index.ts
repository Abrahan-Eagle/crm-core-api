import { GetApplicationByIdQueryHandler } from './get-application-by-id.query-handler';
import { GetBankNotificationsQueryHandler } from './get-bank-notifications.query-handler';
import { GetDraftByIdQueryHandler } from './get-draft-by-id.query-handler';
import { GetLastApplicationPeriodQueryHandler } from './get-last-application-period.query-handler';
import { GetRecommendedBanksQueryHandler } from './get-recommended-banks.query-handler';
import { SearchApplicationsQueryHandler } from './search-applications.query-handler';
import { SearchDraftApplicationsQueryHandler } from './search-draft-applications.query-handler';

export const ApplicationQueryHandlers = [
  GetApplicationByIdQueryHandler,
  GetBankNotificationsQueryHandler,
  GetDraftByIdQueryHandler,
  GetLastApplicationPeriodQueryHandler,
  GetRecommendedBanksQueryHandler,
  SearchApplicationsQueryHandler,
  SearchDraftApplicationsQueryHandler,
];
