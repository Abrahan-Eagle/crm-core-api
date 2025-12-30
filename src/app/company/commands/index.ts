import { AddCompanyDocumentCommandHandler } from './add-company-document.command-handler';
import { AddCompanyNoteCommandHandler } from './add-company-note.command-handler';
import { CreateCompanyCommandHandler } from './create-company.command-handler';
import { DeleteCompanyDocumentCommandHandler } from './delete-company-document.command-handler';
import { RemoveCompanyNoteCommandHandler } from './remove-company-note.command-handler';
import { TransferCompanyCommandHandler } from './transfer-company.command-handler';
import { UpdateCompanyCommandHandler } from './update-company.command-handler';

export * from './create-company.command-handler';
export * from './delete-company-document.command-handler';
export * from './update-company.command-handler';

export const CompanyCommandHandlers = [
  CreateCompanyCommandHandler,
  AddCompanyNoteCommandHandler,
  DeleteCompanyDocumentCommandHandler,
  AddCompanyDocumentCommandHandler,
  RemoveCompanyNoteCommandHandler,
  TransferCompanyCommandHandler,
  UpdateCompanyCommandHandler,
];
