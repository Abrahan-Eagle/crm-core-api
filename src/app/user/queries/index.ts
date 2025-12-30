import { GetUserByIdQueryHandler } from './get-user-by-id.query-handler';
import { GetUserRolesQueryHandler } from './get-user-roles.query-handler';
import { SearchUsersQueryHandler } from './search-users.query-handler';

export * from './get-user-by-id.query-handler';

export const UserQueryHandlers = [GetUserByIdQueryHandler, GetUserRolesQueryHandler, SearchUsersQueryHandler];
