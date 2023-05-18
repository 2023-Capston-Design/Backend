import { Role } from '../enum/role.enum';

export enum JwtSubjectType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export interface JwtPayload {
  user_id?: number;
  user_role?: Role;
}

export interface JwtDecodedPayload extends JwtPayload {
  sub: JwtSubjectType;
  iat: number;
  nbf: number;
  exp: number;
  aud: string;
  iss: string;
}
