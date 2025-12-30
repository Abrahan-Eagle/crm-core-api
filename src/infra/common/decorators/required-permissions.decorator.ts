import { SetMetadata } from '@nestjs/common';

import { Permission } from '../permissions';

export const PERMISSION_KEY = 'permissions';
export const RequiredPermissions = (...permissions: Permission[]) => SetMetadata(PERMISSION_KEY, permissions);
