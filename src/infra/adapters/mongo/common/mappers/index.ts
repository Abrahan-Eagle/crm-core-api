import { AddressMapper } from './address.mapper';
import { EmailMapper } from './email.mapper';
import { IndustryMapper } from './industry.mapper';
import { NoteMapper } from './note.mapper';
import { PhoneMapper } from './phone.mapper';
import { TaxIdMapper } from './tax-id.mapper';

export * from './address.mapper';
export * from './email.mapper';
export * from './industry.mapper';
export * from './note.mapper';
export * from './phone.mapper';
export * from './tax-id.mapper';

export const CommonMappers = [AddressMapper, EmailMapper, IndustryMapper, NoteMapper, PhoneMapper, TaxIdMapper];
