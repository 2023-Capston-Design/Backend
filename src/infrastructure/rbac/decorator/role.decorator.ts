import { SetMetadata } from '@nestjs/common';
import { Role } from '../../enum/role.enum';

export const AllowedRole = (roles: Role[]) => SetMetadata('roles', roles);
