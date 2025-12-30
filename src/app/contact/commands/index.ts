import { AddContactDocumentCommandHandler } from './add-contact-document.command-handler';
import { AddContactNoteCommandHandler } from './add-contact-note.command-handler';
import { CreateContactCommandHandler } from './create-contact.command-handler';
import { DeleteContactDocumentCommandHandler } from './delete-contact-document.command-handler';
import { OptInProspectCommandHandler } from './opt-in-prospect.command-handler';
import { RemoveContactNoteCommandHandler } from './remove-contact-note.command-handler';
import { UpdateContactCommandHandler } from './update-contact.command-handler';

export const ContactCommandHandlers = [
  CreateContactCommandHandler,
  AddContactNoteCommandHandler,
  UpdateContactCommandHandler,
  AddContactDocumentCommandHandler,
  OptInProspectCommandHandler,
  RemoveContactNoteCommandHandler,
  DeleteContactDocumentCommandHandler,
];
