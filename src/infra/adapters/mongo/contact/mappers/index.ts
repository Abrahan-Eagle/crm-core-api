import { ContactMapper } from './contact.mapper';
import { ContactFileMapper } from './contact-file.mapper';

export * from './contact.mapper';
export * from './contact-file.mapper';

export const ContactMappers = [ContactMapper, ContactFileMapper];
