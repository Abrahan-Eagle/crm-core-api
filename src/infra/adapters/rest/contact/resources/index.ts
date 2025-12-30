import { AddContactDocumentResource } from './add-contact-document.resource';
import { AddContactNoteResource } from './add-contact-note.resource';
import { CreateContactResource } from './create-contact.resource';
import { DeleteContactDocumentResource } from './delete-contact-document.resource';
import { GetContactByIdResource } from './get-contact-by-id.resource';
import { GetContactBySSNResource } from './get-contact-by-ssn.resource';
import { OptInProspectResource } from './opt-in-prospect.resource';
import { RemoveContactNoteResource } from './remove-contact-note.resource';
import { SearchContactsResource } from './search-contacts.resource';
import { UpdateContactResource } from './update-contact.resource';

export const ContactResources = [
  AddContactDocumentResource,
  AddContactNoteResource,
  CreateContactResource,
  DeleteContactDocumentResource,
  GetContactByIdResource,
  GetContactBySSNResource,
  OptInProspectResource,
  RemoveContactNoteResource,
  SearchContactsResource,
  UpdateContactResource,
];
