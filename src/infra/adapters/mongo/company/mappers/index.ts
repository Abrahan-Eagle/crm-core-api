import { CompanyMapper } from './company.mapper';
import { CompanyFileMapper } from './company-file.mapper';
import { CompanyMemberMapper } from './company-member.mapper';

export * from './company.mapper';
export * from './company-file.mapper';
export * from './company-member.mapper';

export const CompanyMappers = [CompanyMapper, CompanyMemberMapper, CompanyFileMapper];
