import { GetContactByIdQueryHandler } from './get-contact-by-id.query-handler';
import { GetContactBySSNQueryHandler } from './get-contact-by-ssn.query-handler';
import { SearchContactsQueryHandler } from './search-contacts.query-handler';

export * from './search-contacts.query-handler';

export const ContactQueryHandlers = [
  SearchContactsQueryHandler,
  GetContactBySSNQueryHandler,
  GetContactByIdQueryHandler,
];
