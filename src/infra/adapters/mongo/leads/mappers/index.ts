import { CallLogMapper } from './call-log.mapper';
import { LeadGroupMapper } from './lead-group.mapper';
import { ProspectMapper } from './prospect.mapper';

export * from './call-log.mapper';
export * from './lead-group.mapper';
export * from './prospect.mapper';

export const LeadMappers = [LeadGroupMapper, ProspectMapper, CallLogMapper];
