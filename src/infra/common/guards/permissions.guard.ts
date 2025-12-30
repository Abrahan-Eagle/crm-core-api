import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY } from '../decorators';
import { Permission } from '../permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { token } = context.switchToHttp().getRequest();
    Object.assign(context.switchToHttp().getRequest(), { permissions: token?.permissions ?? [] });
    return requiredPermissions.some((permission) => token?.permissions?.includes(permission));
  }
}
