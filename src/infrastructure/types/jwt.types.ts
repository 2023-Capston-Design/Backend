import { Role } from '../enum/role.enum';

export enum JwtSubjectType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export interface FilteredJwtPayload {
  user_id?: number;
  user_role?: Role;
}

export interface JwtPayload extends FilteredJwtPayload {
  sub: JwtSubjectType;
  iat: number;
  nbf: number;
  exp: number;
  aud: string;
  iss: string;
}
