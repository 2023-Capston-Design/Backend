import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '@src/infrastructure/enum/role.enum';
import { Reflector } from '@nestjs/core';
import { FilteredJwtPayload } from '@src/infrastructure/types/jwt.types';

/**
 * This decorator require after @AuthGuard
 *
 * -> After validation, @AuthGuard add '
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const availableRoles = this.reflector.get<Role>(
      'roles',
      context.getHandler(),
    );
    /**
     * Return true
     *
     * 1. If no role designated
     * 2. If role name 'any' defined
     *
     * - hoplin
     */
    if (!availableRoles || availableRoles.includes('any')) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: FilteredJwtPayload = request.user;

    if (!user) return false;
    // User's role will be defined in 'user.user_role'
    return availableRoles.includes(user.user_role);
  }
}
