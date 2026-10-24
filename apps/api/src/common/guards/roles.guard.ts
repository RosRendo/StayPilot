import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../decorators/current-user.decorator';
import { HotelRole, PlatformRole } from '@staypilot/shared-types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(HotelRole | PlatformRole)[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('User session is required');
    }

    if (user.platformRole === PlatformRole.SUPERADMIN) {
      return true;
    }

    // Role hierarchy checking
    const roleRank: Record<string, number> = {
      [HotelRole.RECEPTIONIST]: 1,
      [HotelRole.MANAGER]: 2,
      [HotelRole.OWNER]: 3,
    };

    const userRole = user.activeRole;
    if (!userRole) {
      throw new ForbiddenException('No active role found');
    }

    const userRank = roleRank[userRole] || 0;
    const hasPermission = requiredRoles.some((role) => {
      const requiredRank = roleRank[role as string];
      return requiredRank !== undefined ? userRank >= requiredRank : role === userRole;
    });

    if (!hasPermission) {
      throw new ForbiddenException(`Insufficient permissions: requires ${requiredRoles.join(' or ')}`);
    }

    return true;
  }
}
