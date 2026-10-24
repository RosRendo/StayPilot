import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('User session is required for tenant access');
    }

    if (user.platformRole === 'SUPERADMIN') {
      return true;
    }

    // Determine target hotel ID from headers, queries, or user default
    const headerHotelId = request.headers['x-hotel-id'] as string;
    const queryHotelId = request.query?.hotelId as string;
    const targetHotelId = headerHotelId || queryHotelId || user.memberships[0]?.hotelId;

    if (!targetHotelId) {
      throw new ForbiddenException('No active hotel membership found for this user account');
    }

    // Verify user membership in this hotel
    const membership = user.memberships.find((m) => m.hotelId === targetHotelId);
    if (!membership) {
      throw new ForbiddenException('Access denied: You do not have permissions for this hotel');
    }

    // Attach active hotel and role to request
    request.hotelId = targetHotelId;
    user.activeHotelId = targetHotelId;
    user.activeRole = membership.role;

    return true;
  }
}
