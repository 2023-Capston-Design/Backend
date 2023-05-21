import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export enum MAIL_ERROR {
  RECEIVER_NOT_DEFINED = 'RECEIVER_NOT_DEFINED',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
}

export class ReceiverNotDefined extends BadRequestException {
  constructor() {
    super('수신자가 정의되지 않았습니다', MAIL_ERROR.RECEIVER_NOT_DEFINED);
  }
}

export class TokenNotFound extends UnauthorizedException {
  constructor() {
    super('인증토큰이 db에서 발견되지 않았습니다', MAIL_ERROR.TOKEN_NOT_FOUND);
  }
}
