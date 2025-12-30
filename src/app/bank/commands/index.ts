import { AddBankDocumentCommandHandler } from './add-bank-document.command-handler';
import { CreateBankCommandHandler } from './create-bank.command-handler';
import { DeleteBankDocumentCommandHandler } from './delete-bank-document.command-handler';
import { RemoveFromBlacklistBankCommandHandler } from './remove-from-blacklist-bank.command-handler';
import { SendEmailToBanksCommandHandler } from './send-email-to-banks.command-handler';
import { SendBankToBlackListCommandHandler } from './send-to-blacklist-bank.command-handler';
import { UpdateBankCommandHandler } from './update-bank.command-handler';

export * from './add-bank-document.command-handler';
export * from './create-bank.command-handler';
export * from './delete-bank-document.command-handler';
export * from './remove-from-blacklist-bank.command-handler';
export * from './send-email-to-banks.command-handler';
export * from './send-to-blacklist-bank.command-handler';
export * from './update-bank.command-handler';

export const BankCommandHandlers = [
  AddBankDocumentCommandHandler,
  CreateBankCommandHandler,
  DeleteBankDocumentCommandHandler,
  RemoveFromBlacklistBankCommandHandler,
  SendBankToBlackListCommandHandler,
  SendEmailToBanksCommandHandler,
  UpdateBankCommandHandler,
];
