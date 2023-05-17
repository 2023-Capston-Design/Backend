import { BadRequestException, ConflictException } from '@nestjs/common';

export enum MEMBER_ERROR {
  MEMBER_NOT_FOUND = 'MEMBER_NOT_FOUND',
  DUPLICATED_STUDENT_ID = 'DUPLICATED_STUDENT_ID',
  DUPLIcATED_EMAIL = 'DUPLICATED_EMAIL',
}

export class MemberNotFound extends BadRequestException {
  constructor() {
    super('사용자를 찾을 수 없습니다', MEMBER_ERROR.MEMBER_NOT_FOUND);
  }
}

export class DuplicatedStudentId extends ConflictException {
  constructor() {
    super('이미 등록된 학생 ID입니다', MEMBER_ERROR.DUPLICATED_STUDENT_ID);
  }
}

export class DuplicatedEmail extends ConflictException {
  constructor() {
    super('이미 등록된 E-Mail입니다', MEMBER_ERROR.DUPLIcATED_EMAIL);
  }
}
