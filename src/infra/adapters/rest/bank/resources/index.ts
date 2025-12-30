import { AddBankDocumentResource } from './add-bank-document.resource';
import { CreateBankResource } from './create-bank.resource';
import { DeleteBankDocumentResource } from './delete-bank-document.resource';
import { GetBankByIdResource } from './get-bank-by-id.resource';
import { GetBankOffersResource } from './get-bank-offers.resource';
import { RemoveFromBlacklistBankResource } from './remove-from-blacklist-bank.resource';
import { SearchBanksResource } from './search-banks.resource';
import { SendBankToBlackListResource } from './send-bank-to-black-list.resource';
import { SendEmailToBanksResource } from './send-email-to-banks.resource';
import { UpdateBankResource } from './update-bank.resource';

export const BankResources = [
  AddBankDocumentResource,
  CreateBankResource,
  DeleteBankDocumentResource,
  GetBankByIdResource,
  GetBankOffersResource,
  RemoveFromBlacklistBankResource,
  SearchBanksResource,
  SendBankToBlackListResource,
  SendEmailToBanksResource,
  UpdateBankResource,
];
