import { Request } from 'express';

import { Permission } from '../permissions';

export function requestHasPermission(permission: Permission, request: Request) {
  const permissions = (request as Request & { permissions?: string[] })?.permissions ?? [];
  return permissions.includes(permission);
}

export function hasPermission(target: Permission, permissions: string[]) {
  return permissions.includes(target);
}
