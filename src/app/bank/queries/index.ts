import { GetBankByIdQueryHandler } from './get-bank-by-id.query-handler';
import { GetBankOffersQueryHandler } from './get-bank-offers.query-handler';
import { SearchBanksQueryHandler } from './search-banks.query-handler';

export const BankQueryHandlers = [SearchBanksQueryHandler, GetBankOffersQueryHandler, GetBankByIdQueryHandler];
