import { AddNoteToProspectCommandHandler } from './add-note-to-prospect.command-handler';
import { CreateLeadCommandHandler } from './create-lead.command-handler';
import { TransferLeadPropertyCommandHandler } from './transfer-lead-property.command-handler';

export * from './create-lead.command-handler';

export const LeadCommandHandlers = [
  AddNoteToProspectCommandHandler,
  CreateLeadCommandHandler,
  TransferLeadPropertyCommandHandler,
];
