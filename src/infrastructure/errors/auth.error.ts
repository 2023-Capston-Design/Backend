import { UnauthorizedException } from '@nestjs/common';
import { extend } from 'joi';

export enum AUTH_ERROR {
  NEED_TOKEN = 'NEED_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNCONFIRMED_ROLE = 'UNCONFIRMED_ROLE',
}

export class NeedToken extends UnauthorizedException {
  constructor() {
    super('토큰이 발견되지 않았습니다', AUTH_ERROR.NEED_TOKEN);
  }
}

export class InvalidToken extends UnauthorizedException {
  constructor() {
    super('올바르지 않은 토큰입니다', AUTH_ERROR.INVALID_TOKEN);
  }
}

export class UnconfirmedRole extends UnauthorizedException {
  constructor() {
    super('확인되지 않은 role', AUTH_ERROR.UNCONFIRMED_ROLE);
  }
}
