import { SetMetadata } from '@nestjs/common';
import { HotelRole, PlatformRole } from '@staypilot/shared-types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (HotelRole | PlatformRole)[]) => SetMetadata(ROLES_KEY, roles);
